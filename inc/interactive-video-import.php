<?php
/**
 * Interactive Video Import via WP-CLI
 *
 * Bulk-imports interactive video questions and responses from a CSV or
 * TSV file. Delimiter (comma or tab) is auto-detected, so a file copied
 * directly out of Excel/Google Sheets (tab-separated) works just as well
 * as a proper CSV export. Maps file rows to WordPress concert posts using
 * fuzzy matching, across ALL WPML languages.
 *
 * By default, questions are mirrored onto every WPML translation of the
 * matched concert: a row matching the English "Bach Cantata BWV 140" also
 * adds the same question/video pair to the French version, so the
 * interactive experience exists in both languages. The question text is
 * copied verbatim, so it may still need translating afterwards.
 *
 * To target a single language instead, add an optional column whose header
 * contains "lang" (e.g. "Language") with a value like "en", "fr",
 * "English", or "Français". Rows with a recognized language match only a
 * concert in that exact language AND skip mirroring, so you can import a
 * batch of French subtitles without touching the English version (or vice
 * versa).
 *
 * Usage:
 *   wp festival import-interactive-video /path/to/qna.csv
 *   wp festival import-interactive-video /path/to/qna.tsv
 *   wp festival import-interactive-video --dry-run /path/to/qna.csv
 *
 * @package festival-bach-understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * Register WP-CLI command.
 */
function festival_register_import_command() {
    if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
        return;
    }

    WP_CLI::add_command( 'festival import-interactive-video', 'festival_import_interactive_video_cmd' );
}
add_action( 'init', 'festival_register_import_command' );

/**
 * WP-CLI callback: import interactive video questions from CSV.
 *
 * @param array $args       Positional arguments.
 * @param array $assoc_args Associative arguments.
 */
function festival_import_interactive_video_cmd( $args, $assoc_args ) {
    $dry_run = ! empty( $assoc_args['dry-run'] );

    if ( empty( $args[0] ) ) {
        WP_CLI::error( 'Usage: wp festival import-interactive-video [--dry-run] <path/to/file.csv>' );
    }

    $csv_path = $args[0];
    if ( ! file_exists( $csv_path ) || ! is_readable( $csv_path ) ) {
        WP_CLI::error( "File not found or not readable: {$csv_path}" );
    }

    // ── Parse CSV/TSV ────────────────────────────────────────
    $handle = fopen( $csv_path, 'r' );
    if ( ! $handle ) {
        WP_CLI::error( 'Could not open CSV file.' );
    }

    // Peek at the first line to detect whether this is comma- or
    // tab-delimited (tab-separated is what you get pasting straight out of
    // Excel/Sheets, and it sidesteps the "comma inside a field" problem).
    $first_line = fgets( $handle );
    if ( false === $first_line ) {
        WP_CLI::error( 'Empty CSV file.' );
    }
    rewind( $handle );
    $delimiter = festival_detect_csv_delimiter( $first_line );

    // Read header.
    $header = fgetcsv( $handle, 0, $delimiter );
    if ( ! $header ) {
        WP_CLI::error( 'Empty CSV file.' );
    }

    WP_CLI::log( sprintf( 'Detected delimiter: %s', ( "\t" === $delimiter ) ? 'tab' : 'comma' ) );

    // Normalize header columns.
    $col_concert       = 0;   // First column = concert name.
    $col_question      = null;
    $col_video_url     = null;
    $col_lang          = null; // Optional — restricts matching to one language when present.

    foreach ( $header as $idx => $col ) {
        $col_clean = trim( $col );
        if ( stripos( $col_clean, 'question' ) !== false ) {
            $col_question = $idx;
        }
        if ( stripos( $col_clean, 'url of video' ) !== false || stripos( $col_clean, 'video render' ) !== false ) {
            $col_video_url = $idx;
        }
        if ( stripos( $col_clean, 'lang' ) !== false ) {
            $col_lang = $idx;
        }
    }

    if ( null === $col_question ) {
        WP_CLI::error( 'Could not find a "Question" column in CSV.' );
    }
    if ( null === $col_video_url ) {
        WP_CLI::error( 'Could not find a "URL of video rendering" column in CSV.' );
    }
    if ( null !== $col_lang ) {
        WP_CLI::log( 'Detected a Language column — rows naming a language match only that language version, and are not mirrored to translations.' );
    } else {
        WP_CLI::log( 'No Language column — questions will be mirrored onto every translation of each matched concert.' );
    }

    // ── Pre-fetch all concert posts (every language) ────────
    $concerts_query = new WP_Query( array(
        'post_type'      => 'concerts',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'orderby'        => 'title',
        'order'          => 'ASC',
        'suppress_filters' => true, // Explicit: we want every language, not just the current one.
    ) );

    $lookup      = festival_build_concert_lookup( $concerts_query->have_posts() ? $concerts_query->posts : array() );
    $concert_map = $lookup['concert_map'];
    $id_map      = $lookup['id_map'];

    // ── Process CSV rows ────────────────────────────────────
    $stats = array(
        'total_rows'       => 0,
        'matched'          => 0,
        'unmatched'        => 0,
        'unmatched_names'  => array(),
        'updated_posts'    => array(),
        'row_warnings'     => array(),
    );

    $header_col_count = count( $header );
    $csv_row_number    = 1; // The header itself was row 1.

    while ( ( $row = fgetcsv( $handle, 0, $delimiter ) ) !== false ) {
        $csv_row_number++;
        $stats['total_rows']++;

        $concert_name_raw = isset( $row[ $col_concert ] ) ? trim( $row[ $col_concert ], " \t\n\r\0\x0B\"'" ) : '';
        $question_text    = isset( $row[ $col_question ] ) ? trim( $row[ $col_question ] ) : '';
        $video_url        = isset( $row[ $col_video_url ] ) ? trim( $row[ $col_video_url ] ) : '';
        $lang_raw         = ( null !== $col_lang && isset( $row[ $col_lang ] ) ) ? trim( $row[ $col_lang ] ) : '';
        $lang_code        = ( '' !== $lang_raw ) ? festival_resolve_language_code( $lang_raw ) : '';

        $row_issues = festival_validate_csv_row( $row, $header_col_count, $video_url );
        if ( ! empty( $row_issues ) ) {
            $stats['row_warnings'][] = array(
                'row'      => $csv_row_number,
                'concert'  => $concert_name_raw ?: '(blank)',
                'messages' => $row_issues,
            );
        }

        if ( '' !== $lang_raw && '' === $lang_code ) {
            WP_CLI::warning( "Row {$csv_row_number}: couldn't recognize language \"{$lang_raw}\" — ignoring the language hint for this row." );
        }

        if ( empty( $concert_name_raw ) || empty( $question_text ) || empty( $video_url ) ) {
            continue; // Skip empty rows.
        }

        // Match concert.
        $post = festival_find_concert( $concert_name_raw, $concert_map, $id_map, $lang_code );

        if ( ! $post ) {
            $stats['unmatched']++;
            if ( ! isset( $stats['unmatched_names'][ $concert_name_raw ] ) ) {
                $stats['unmatched_names'][ $concert_name_raw ] = 0;
            }
            $stats['unmatched_names'][ $concert_name_raw ]++;
            continue;
        }

        $stats['matched']++;

        if ( ! isset( $stats['updated_posts'][ $post->ID ] ) ) {
            $stats['updated_posts'][ $post->ID ] = array(
                'title'       => festival_format_concert_label( $post ),
                'questions'   => array(),
                'lang_locked' => false,
            );
        }

        // A row that named a language pins this concert to that version only.
        // If any contributing row did so, don't mirror to translations.
        if ( '' !== $lang_code ) {
            $stats['updated_posts'][ $post->ID ]['lang_locked'] = true;
        }

        $stats['updated_posts'][ $post->ID ]['questions'][] = array(
            'question'  => $question_text,
            'video_url' => $video_url,
        );
    }

    fclose( $handle );

    // ── Apply to WordPress ──────────────────────────────────
    if ( empty( $stats['updated_posts'] ) ) {
        WP_CLI::warning( 'No concert matches found. Nothing to import.' );
        return;
    }

    $total_questions = 0;
    $written_posts   = array();
    $mirrored_posts  = array();

    foreach ( $stats['updated_posts'] as $post_id => $info ) {
        $questions = $info['questions'];

        // Unless a row pinned a language, mirror onto every translation so the
        // same interactive answers exist on the EN and FR version alike.
        $targets = festival_resolve_import_targets( $post_id, empty( $info['lang_locked'] ) );

        foreach ( $targets as $target_id ) {
            $is_mirror    = ( (int) $target_id !== (int) $post_id );
            $target_label = $is_mirror ? festival_format_concert_label( get_post( $target_id ) ) : $info['title'];

            if ( $dry_run ) {
                $suffix = $is_mirror ? ' [translation]' : '';
                WP_CLI::line( "[DRY RUN] Would update '{$target_label}' (ID {$target_id}) with " . count( $questions ) . " questions.{$suffix}" );
                $total_questions += count( $questions );
                continue;
            }

            // Instead of overwriting, we APPEND to existing questions.
            $result = festival_append_questions_to_concert( $target_id, $questions );

            if ( $result['added'] > 0 ) {
                $written_posts[ $target_id ] = true;
                if ( $is_mirror ) {
                    $mirrored_posts[ $target_id ] = true;
                }
            }

            $total_questions += $result['added'];
            $suffix           = $is_mirror ? ' [translation]' : '';
            WP_CLI::line( "✓ '{$target_label}': {$result['added']} questions added (total now: {$result['total']}).{$suffix}" );
        }
    }

    // ── Report ──────────────────────────────────────────────
    WP_CLI::success( sprintf(
        'Processed %d rows: %d matched to concerts, %d unmatched. %d questions added/updated across %d concerts.',
        $stats['total_rows'],
        $stats['matched'],
        $stats['unmatched'],
        $total_questions,
        $dry_run ? count( $stats['updated_posts'] ) : count( $written_posts )
    ) );

    if ( ! empty( $mirrored_posts ) ) {
        WP_CLI::log( sprintf(
            'Mirrored onto %d translated concert version(s). The question text was copied as-is, so it may still need translating.',
            count( $mirrored_posts )
        ) );
    }

    if ( ! empty( $stats['unmatched_names'] ) ) {
        WP_CLI::warning( 'Unmatched concert names in CSV:' );
        foreach ( $stats['unmatched_names'] as $name => $count ) {
            // Show suggestion for each unmatched name.
            $suggestion = festival_suggest_concert_match( $name, $id_map );
            $line = "  • '{$name}' ({$count} rows)";
            if ( $suggestion ) {
                $line .= " → did you mean '{$suggestion}'?";
            }
            WP_CLI::line( $line );
        }
    }

    if ( ! empty( $stats['row_warnings'] ) ) {
        WP_CLI::warning( sprintf(
            '%d row(s) may have formatting issues (often an unquoted comma inside a field):',
            count( $stats['row_warnings'] )
        ) );
        foreach ( $stats['row_warnings'] as $w ) {
            WP_CLI::line( sprintf(
                '  • Row %d (%s): %s',
                $w['row'],
                $w['concert'],
                implode( '; ', $w['messages'] )
            ) );
        }
        WP_CLI::line( '  Tip: wrap any field containing a comma in double quotes, e.g. "Bach, Prelude in C".' );
    }
}

// Helper functions (festival_normalize_concert_title, festival_find_concert,
// festival_suggest_concert_match, festival_validate_csv_row,
// festival_detect_csv_delimiter, festival_build_concert_lookup,
// festival_get_active_languages, festival_get_post_language_code,
// festival_format_concert_label, festival_resolve_language_code,
// festival_get_concert_translations, festival_get_concert_in_language) are
// defined in interactive-video-helper.php.