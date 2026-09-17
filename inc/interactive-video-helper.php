<?php
/**
 * Interactive Video Helper
 *
 * Provides utility functions for the interactive video experience.
 * This helper reads the ACF data and prepares it for the template and JS.
 *
 * @package festival-bach-understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * Check if the current concert has interactive videos enabled.
 *
 * @param int|null $post_id Optional. Post ID. Defaults to current post.
 * @return bool True if interactive video is enabled and has questions.
 */
function festival_concert_has_interactive_video( $post_id = null ) {
    if ( null === $post_id ) {
        $post_id = get_the_ID();
    }

    $enabled = (bool) get_field( 'interactive_video_enabled', $post_id );
    if ( ! $enabled ) {
        return false;
    }

    // Must have an idle video and at least one question.
    $idle_url  = trim( (string) get_field( 'interactive_video_idle_url', $post_id ) );
    $questions = get_field( 'interactive_questions', $post_id );

    if ( empty( $idle_url ) || empty( $questions ) || ! is_array( $questions ) ) {
        return false;
    }

    // Make sure at least one question has both text and a video URL.
    foreach ( $questions as $q ) {
        if ( ! empty( $q['question'] ) && ! empty( $q['video_url'] ) ) {
            return true;
        }
    }

    return false;
}

/**
 * Get the interactive video data for a concert, formatted for JS.
 *
 * @param int|null $post_id Optional. Post ID. Defaults to current post.
 * @return array|null Array of interactive data, or null if not available.
 */
function festival_get_interactive_video_data( $post_id = null ) {
    if ( null === $post_id ) {
        $post_id = get_the_ID();
    }

    if ( ! festival_concert_has_interactive_video( $post_id ) ) {
        return null;
    }

    $idle_url                 = esc_url( trim( (string) get_field( 'interactive_video_idle_url', $post_id ) ) );
    $auto_closed_captions     = (bool) get_field( 'interactive_video_auto_closed_captions', $post_id );
    $questions_raw            = get_field( 'interactive_questions', $post_id );

    $questions = array();
    if ( is_array( $questions_raw ) ) {
        foreach ( $questions_raw as $index => $q ) {
            if ( empty( $q['question'] ) || empty( $q['video_url'] ) ) {
                continue;
            }

            // Decode entities first so JS/HTML never double-encodes quotes (&#039; etc.).
            $question_text = html_entity_decode(
                (string) $q['question'],
                ENT_QUOTES | ENT_HTML5,
                'UTF-8'
            );

            $questions[] = array(
                'id'       => 'q-' . $index,
                'question' => wp_strip_all_tags( $question_text ),
                'videoUrl' => esc_url( trim( $q['video_url'] ) ),
            );
        }
    }

    return array(
        'concertId'         => (int) $post_id,
        'idleVideoUrl'      => $idle_url,
        'autoClosedCaptions'=> $auto_closed_captions,
        'questions'         => $questions,
        'i18n'              => array(
            'ready'            => __( 'Ready — select a question', 'festival-bach-understrap' ),
            'idle'             => __( 'Listening — select a question', 'festival-bach-understrap' ),
            'returning'        => __( 'Returning…', 'festival-bach-understrap' ),
            'unsupported'      => __( 'Unsupported video platform', 'festival-bach-understrap' ),
            'tipTitle'         => __( 'New: talk with Bach', 'festival-bach-understrap' ),
            'tipText'          => __( 'Ask him your questions to discover this concert.', 'festival-bach-understrap' ),
            'dismiss'          => __( 'Dismiss', 'festival-bach-understrap' ),
            'ctaKicker'        => __( 'Interactive experience', 'festival-bach-understrap' ),
            'openCta'          => __( 'Ask me a question', 'festival-bach-understrap' ),
            'ctaSubtext'       => __( 'Choose a question to discover more through video.', 'festival-bach-understrap' ),
            'markWatched'      => __( 'Mark watched', 'festival-bach-understrap' ),
            'markUnwatched'    => __( 'Mark unwatched', 'festival-bach-understrap' ),
            'watched'          => __( 'Watched', 'festival-bach-understrap' ),
            'markAsWatched'    => __( 'Mark as watched', 'festival-bach-understrap' ),
            'markAsUnwatched'  => __( 'Mark as unwatched', 'festival-bach-understrap' ),
        ),
    );
}

/**
 * Extract the video platform and ID from a URL.
 * Supports YouTube and Vimeo.
 *
 * @param string $url The video URL.
 * @return array|null Array with 'platform' and 'id', or null if unsupported.
 */
function festival_parse_video_url( $url ) {
    $parsed = array();

    // YouTube patterns.
    $youtube_patterns = array(
        '/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/',
        '/youtu\.be\/([a-zA-Z0-9_-]+)/',
        '/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/',
        '/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/',
    );

    foreach ( $youtube_patterns as $pattern ) {
        if ( preg_match( $pattern, $url, $matches ) ) {
            return array(
                'platform' => 'youtube',
                'id'       => $matches[1],
            );
        }
    }

    // Vimeo patterns.
    $vimeo_patterns = array(
        '/vimeo\.com\/(\d+)/',
        '/vimeo\.com\/video\/(\d+)/',
        '/player\.vimeo\.com\/video\/(\d+)/',
    );

    foreach ( $vimeo_patterns as $pattern ) {
        if ( preg_match( $pattern, $url, $matches ) ) {
            return array(
                'platform' => 'vimeo',
                'id'       => $matches[1],
            );
        }
    }

    return null;
}

/**
 * Get the WPML active languages, if WPML is running.
 *
 * @return array Keyed by language code, e.g. 'en' => [ 'native_name' => 'English', 'translated_name' => 'English', ... ].
 *               Empty array if WPML isn't active.
 */
function festival_get_active_languages() {
    if ( ! has_filter( 'wpml_active_languages' ) ) {
        return array();
    }

    $languages = apply_filters( 'wpml_active_languages', null, array( 'skip_missing' => 0 ) );

    return is_array( $languages ) ? $languages : array();
}

/**
 * Get the WPML language code of a post (e.g. 'en', 'fr').
 *
 * @param int $post_id Post ID.
 * @return string Language code, or '' if WPML isn't active or it can't be determined.
 */
function festival_get_post_language_code( $post_id ) {
    if ( ! has_filter( 'wpml_post_language_details' ) ) {
        return '';
    }

    $details = apply_filters( 'wpml_post_language_details', null, $post_id );

    return ( is_array( $details ) && ! empty( $details['language_code'] ) ) ? $details['language_code'] : '';
}

/**
 * Get the other-language versions of a concert.
 *
 * WPML links translations together via a "trid" (translation group ID), so
 * we look up the group for this post and return its siblings. Note the
 * element type here must be prefixed ('post_concerts'), unlike the
 * 'wpml_object_id' filter which takes the bare post type ('concerts').
 *
 * @param int $post_id Concert post ID.
 * @return array<string, int> Language code => post ID, excluding $post_id itself.
 *                            Empty array if WPML isn't active or there are no translations.
 */
function festival_get_concert_translations( $post_id ) {
    if ( ! has_filter( 'wpml_element_trid' ) ) {
        return array();
    }

    $trid = apply_filters( 'wpml_element_trid', null, $post_id, 'post_concerts' );
    if ( empty( $trid ) ) {
        return array();
    }

    $translations = apply_filters( 'wpml_get_element_translations', null, $trid, 'post_concerts' );
    if ( ! is_array( $translations ) ) {
        return array();
    }

    $siblings = array();
    foreach ( $translations as $t ) {
        if ( empty( $t->element_id ) || empty( $t->language_code ) ) {
            continue;
        }
        if ( (int) $t->element_id === (int) $post_id ) {
            continue;
        }

        // WPML's translation table can outlive the post it points at, so make
        // sure the sibling is still a real, non-trashed concert before callers
        // try to label it or write questions to it.
        $sibling = get_post( $t->element_id );
        if ( ! $sibling || 'concerts' !== $sibling->post_type ) {
            continue;
        }
        if ( in_array( $sibling->post_status, array( 'trash', 'auto-draft' ), true ) ) {
            continue;
        }

        $siblings[ $t->language_code ] = (int) $t->element_id;
    }

    return $siblings;
}

/**
 * Get a single specific translation of a concert.
 *
 * Thin wrapper over WPML's 'wpml_object_id' filter, kept here so callers
 * don't have to remember the argument order or the unprefixed post type.
 *
 * @param int    $post_id       Concert post ID (in any language).
 * @param string $lang_code     Target language code, e.g. 'en' or 'fr'.
 * @param bool   $fallback_self Whether to return the original post when no
 *                              translation exists in $lang_code.
 * @return int|null Post ID in the requested language, or null if unavailable.
 */
function festival_get_concert_in_language( $post_id, $lang_code, $fallback_self = false ) {
    if ( ! has_filter( 'wpml_object_id' ) ) {
        return $fallback_self ? (int) $post_id : null;
    }

    $translated = apply_filters( 'wpml_object_id', $post_id, 'concerts', $fallback_self, $lang_code );

    return $translated ? (int) $translated : null;
}

/**
 * Build a display label for a concert that includes its language, e.g.
 * "Bach Cantata BWV 140 (FR)". Falls back to the bare title if WPML isn't
 * active or the post's language can't be determined.
 *
 * @param WP_Post $post Concert post.
 * @return string
 */
function festival_format_concert_label( $post ) {
    $lang = festival_get_post_language_code( $post->ID );

    if ( '' === $lang ) {
        return $post->post_title;
    }

    return sprintf( '%s (%s)', $post->post_title, strtoupper( $lang ) );
}

/**
 * Resolve a raw "language" value (from a CSV column, e.g. "fr", "FR",
 * "French", "Français") to an actual WPML language code, by comparing
 * against the site's active languages.
 *
 * @param string $raw Raw value from a CSV/pasted language column.
 * @return string Matched language code, or '' if it couldn't be resolved
 *                (in which case no language filtering should be applied).
 */
function festival_resolve_language_code( $raw ) {
    $raw = trim( (string) $raw );
    if ( '' === $raw ) {
        return '';
    }

    $languages = festival_get_active_languages();
    if ( empty( $languages ) ) {
        return '';
    }

    $needle = mb_strtolower( $raw, 'UTF-8' );

    foreach ( $languages as $code => $lang ) {
        if ( mb_strtolower( $code, 'UTF-8' ) === $needle ) {
            return $code;
        }
        if ( ! empty( $lang['native_name'] ) && mb_strtolower( $lang['native_name'], 'UTF-8' ) === $needle ) {
            return $code;
        }
        if ( ! empty( $lang['translated_name'] ) && mb_strtolower( $lang['translated_name'], 'UTF-8' ) === $needle ) {
            return $code;
        }
    }

    return '';
}

/**
 * Normalize a concert title for fuzzy matching.
 *
 * Strips accents, lowercases, removes non-alphanumeric chars.
 *
 * @param string $title Raw title.
 * @return string Normalized title.
 */
function festival_normalize_concert_title( $title ) {
    // Remove HTML entities.
    $title = html_entity_decode( $title, ENT_QUOTES | ENT_XML1, 'UTF-8' );

    // Transliterate accented chars to ASCII.
    $title = remove_accents( $title );

    // Lowercase.
    $title = mb_strtolower( trim( $title ), 'UTF-8' );

    // Collapse whitespace.
    $title = preg_replace( '/\s+/', ' ', $title );

    return $title;
}

/**
 * Build the lookup structures used for fuzzy concert matching.
 *
 * Same-titled posts (most commonly EN/FR translations that happen to share
 * a title, or genuinely identical titles) are grouped together under one
 * normalized-title bucket so festival_find_concert() can pick the right
 * language when a language hint is available, instead of the first one
 * seen silently winning.
 *
 * @param WP_Post[] $posts Concert posts (any/all languages).
 * @return array{concert_map: array<string, WP_Post[]>, id_map: array<int, string>}
 */
function festival_build_concert_lookup( $posts ) {
    $concert_map = array();
    $id_map      = array();

    foreach ( $posts as $post ) {
        $normalized           = festival_normalize_concert_title( $post->post_title );
        $id_map[ $post->ID ]  = $post->post_title;

        if ( ! isset( $concert_map[ $normalized ] ) ) {
            $concert_map[ $normalized ] = array();
        }
        $concert_map[ $normalized ][] = $post;
    }

    return array(
        'concert_map' => $concert_map,
        'id_map'      => $id_map,
    );
}

/**
 * Find a concert post by CSV name using fuzzy matching.
 *
 * @param string $raw_name    The concert name from CSV.
 * @param array  $concert_map Normalized title → array of WP_Post (see festival_build_concert_lookup()).
 * @param array  $id_map      Post ID → title map.
 * @param string $lang_filter Optional WPML language code. When set, only a
 *                             post in that exact language is returned for a
 *                             given title bucket — no silent fallback to a
 *                             different language.
 * @return WP_Post|null
 */
function festival_find_concert( $raw_name, $concert_map, $id_map, $lang_filter = '' ) {
    $normalized = festival_normalize_concert_title( $raw_name );

    $pick = function ( $posts ) use ( $lang_filter ) {
        if ( empty( $posts ) ) {
            return null;
        }
        if ( '' === $lang_filter ) {
            return $posts[0];
        }
        foreach ( $posts as $p ) {
            if ( festival_get_post_language_code( $p->ID ) === $lang_filter ) {
                return $p;
            }
        }
        return null; // A post exists with this title, but not in the requested language.
    };

    // 1. Direct match on normalized title.
    if ( isset( $concert_map[ $normalized ] ) ) {
        $match = $pick( $concert_map[ $normalized ] );
        if ( $match ) {
            return $match;
        }
    }

    // 2. Substring: check if normalized name is contained in any concert title.
    foreach ( $concert_map as $norm => $posts ) {
        if ( strpos( $norm, $normalized ) !== false || strpos( $normalized, $norm ) !== false ) {
            $match = $pick( $posts );
            if ( $match ) {
                return $match;
            }
        }
    }

    // 3. Word overlap: check how many significant words match.
    $best_match    = null;
    $best_score    = 0;
    $words_a       = explode( ' ', $normalized );
    $significant_a = array_filter( $words_a, function ( $w ) {
        return strlen( $w ) > 2;
    } );

    foreach ( $concert_map as $norm => $posts ) {
        $words_b       = explode( ' ', $norm );
        $significant_b = array_filter( $words_b, function ( $w ) {
            return strlen( $w ) > 2;
        } );

        $intersection = array_intersect( $significant_a, $significant_b );
        $union        = array_unique( array_merge( $significant_a, $significant_b ) );
        $score        = count( $union ) > 0 ? count( $intersection ) / count( $union ) : 0;

        // Boost score if the post title contains words in the same order.
        $common = count( $intersection );
        if ( $common > 0 && strpos( $norm, $normalized ) !== false ) {
            $score += 0.3;
        }

        if ( $score > $best_score ) {
            $candidate = $pick( $posts );
            if ( $candidate ) {
                $best_score = $score;
                $best_match = $candidate;
            }
        }
    }

    if ( $best_score >= 0.4 ) {
        return $best_match;
    }

    return null;
}

/**
 * Suggest the closest matching concert title for an unmatched name.
 *
 * @param string $raw_name Unmatched CSV concert name.
 * @param array  $id_map   Post ID → title map.
 * @return string|null Suggested title, or null if no close match.
 */
function festival_suggest_concert_match( $raw_name, $id_map ) {
    $normalized = festival_normalize_concert_title( $raw_name );
    $best_match = null;
    $best_dist  = PHP_INT_MAX;

    foreach ( $id_map as $pid => $title ) {
        $title_norm = festival_normalize_concert_title( $title );
        $dist       = levenshtein( $normalized, $title_norm );

        if ( $dist < $best_dist ) {
            $best_dist  = $dist;
            $best_match = $title;
        }
    }

    if ( $best_dist <= 10 ) {
        return $best_match;
    }

    return null;
}

/**
 * Append questions to a concert, skipping any whose text is already present.
 *
 * Also flips the `interactive_video_enabled` flag on when something was
 * actually added, so an imported concert goes live without a second step.
 *
 * @param int   $post_id   Concert post ID.
 * @param array $questions List of [ 'question' => string, 'video_url' => string ].
 * @return array{added: int, total: int} How many were added, and the resulting total.
 */
function festival_append_questions_to_concert( $post_id, $questions ) {
    $existing = get_field( 'interactive_questions', $post_id );
    if ( ! is_array( $existing ) ) {
        $existing = array();
    }

    $existing_texts = array();
    foreach ( $existing as $eq ) {
        if ( isset( $eq['question'] ) ) {
            $existing_texts[ md5( trim( $eq['question'] ) ) ] = true;
        }
    }

    $added = 0;
    foreach ( $questions as $q ) {
        $question_text = isset( $q['question'] ) ? trim( $q['question'] ) : '';
        $video_url     = isset( $q['video_url'] ) ? trim( $q['video_url'] ) : '';

        if ( '' === $question_text || '' === $video_url ) {
            continue;
        }

        $key = md5( $question_text );
        if ( isset( $existing_texts[ $key ] ) ) {
            continue;
        }

        $existing[]             = array(
            'question'  => $question_text,
            'video_url' => $video_url,
        );
        $existing_texts[ $key ] = true;
        $added++;
    }

    if ( $added > 0 ) {
        update_field( 'interactive_questions', $existing, $post_id );

        if ( ! (bool) get_field( 'interactive_video_enabled', $post_id ) ) {
            update_field( 'interactive_video_enabled', true, $post_id );
        }
    }

    return array(
        'added' => $added,
        'total' => count( $existing ),
    );
}

/**
 * Resolve which concert posts an import row should write to.
 *
 * By default a matched concert's translations are included, so importing a
 * batch of question/video pairs makes the same interactive answers available
 * on every language version of that concert rather than only the one whose
 * title happened to match. Callers pass $include_translations = false when the
 * row named an explicit language, which pins the write to that version alone.
 *
 * @param int  $post_id              Matched concert post ID.
 * @param bool $include_translations Whether to also target other languages.
 * @return int[] Post IDs to write to, starting with $post_id.
 */
function festival_resolve_import_targets( $post_id, $include_translations = true ) {
    $targets = array( (int) $post_id );

    if ( ! $include_translations ) {
        return $targets;
    }

    foreach ( festival_get_concert_translations( $post_id ) as $translated_id ) {
        $targets[] = (int) $translated_id;
    }

    return array_values( array_unique( $targets ) );
}

/**
 * Turn off interactive video for a concert that has no questions left.
 *
 * A concert with an empty question set but `interactive_video_enabled` still
 * on is a misleading state: the admin lists it as ACTIVE while the front end
 * (via festival_concert_has_interactive_video()) correctly renders nothing.
 * Called after any deletion so the flag follows the data.
 *
 * @param int $post_id Concert post ID.
 * @return bool True if the concert was just disabled.
 */
function festival_disable_interactive_video_if_empty( $post_id ) {
    $questions = get_field( 'interactive_questions', $post_id );

    if ( is_array( $questions ) && ! empty( $questions ) ) {
        return false;
    }

    if ( ! (bool) get_field( 'interactive_video_enabled', $post_id ) ) {
        return false; // Already off — nothing to report.
    }

    update_field( 'interactive_video_enabled', false, $post_id );

    return true;
}

/**
 * Detect whether tabular data uses tabs or commas as its delimiter.
 *
 * Copying cells directly out of Excel or Google Sheets (rather than using
 * "Export/Download as CSV") produces tab-separated text, which sidesteps
 * the "comma inside a field" problem entirely since a literal tab almost
 * never shows up in a question or concert title. We auto-detect so admins
 * don't have to think about which format they're pasting/uploading.
 *
 * @param string $sample A representative line, usually the header row.
 * @return string Either "\t" or ",".
 */
function festival_detect_csv_delimiter( $sample ) {
    if ( false === strpos( $sample, "\t" ) ) {
        return ',';
    }

    // Only prefer tabs if they actually produce at least as many fields as
    // commas would — guards against a stray tab inside an otherwise normal
    // comma-delimited line.
    $tab_fields   = count( str_getcsv( $sample, "\t" ) );
    $comma_fields = count( str_getcsv( $sample, ',' ) );

    return ( $tab_fields >= $comma_fields ) ? "\t" : ',';
}

/**
 * Sanity-check a parsed CSV row for signs of column misalignment.
 *
 * The most common cause is an unquoted comma inside a field (e.g. a
 * question or concert name containing ", " with no surrounding quotes),
 * which shifts every column after it. This doesn't fix the row — it just
 * flags it so an admin can go double-check the source data.
 *
 * @param array  $row           The parsed row (from fgetcsv/str_getcsv).
 * @param int    $expected_cols Expected column count, taken from the header row.
 * @param string $video_url     The raw value pulled from the video URL column.
 * @return string[] Human-readable warning messages for this row (empty if none).
 */
function festival_validate_csv_row( $row, $expected_cols, $video_url ) {
    $warnings = array();

    if ( count( $row ) !== $expected_cols ) {
        $warnings[] = sprintf(
            /* translators: 1: actual column count found, 2: expected column count */
            __( 'found %1$d column(s), expected %2$d — likely an unquoted comma inside a field', 'festival-bach-understrap' ),
            count( $row ),
            $expected_cols
        );
    }

    // A well-formed video URL should actually look like one. If it doesn't,
    // the columns have probably shifted even when the count happens to match.
    $video_url = trim( (string) $video_url );
    if ( '' !== $video_url && ! preg_match( '#^https?://#i', $video_url ) ) {
        $warnings[] = sprintf(
            /* translators: %s: the value found in the video URL column, truncated */
            __( 'video URL column doesn\'t look like a URL ("%s")', 'festival-bach-understrap' ),
            mb_strimwidth( $video_url, 0, 60, '…' )
        );
    }

    return $warnings;
}

/**
 * Enqueue interactive video assets conditionally.
 */
function festival_enqueue_interactive_video_assets() {
    if ( ! is_singular( 'concerts' ) ) {
        return;
    }

    $post_id = get_the_ID();
    if ( ! festival_concert_has_interactive_video( $post_id ) ) {
        return;
    }

    $theme_version = wp_get_theme()->get( 'Version' );

    // CSS.
    $css_file = '/css/interactive-video.css';
    $css_path = get_stylesheet_directory() . $css_file;
    if ( file_exists( $css_path ) ) {
        wp_enqueue_style(
            'festival-interactive-video',
            get_stylesheet_directory_uri() . $css_file,
            array( 'child-understrap-styles' ),
            $theme_version . '.' . filemtime( $css_path )
        );
    }

    // JS.
    $js_file = '/js/interactive-video.js';
    $js_path = get_stylesheet_directory() . $js_file;
    if ( file_exists( $js_path ) ) {
        wp_enqueue_script(
            'festival-interactive-video',
            get_stylesheet_directory_uri() . $js_file,
            array(),
            $theme_version . '.' . filemtime( $js_path ),
            true
        );

        // Pass concert data to JS.
        $data = festival_get_interactive_video_data( $post_id );
        if ( $data ) {
            wp_localize_script(
                'festival-interactive-video',
                'concertInteractiveData',
                $data
            );
        }
    }
}
add_action( 'wp_enqueue_scripts', 'festival_enqueue_interactive_video_assets', 30 );
