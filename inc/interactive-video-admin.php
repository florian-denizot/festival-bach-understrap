<?php
/**
 * Interactive Video Admin CRUD Interface
 *
 * Provides a wp-admin interface for managing interactive video questions.
 * Three tabs:
 *   1. Overview — summary of all concerts with question counts & status.
 *   2. Manage  — inline edit, add, bulk select/delete, enable/disable per concert.
 *   3. CSV Import — paste CSV or TSV (tab-separated) data with concert name,
 *      question, and video URL columns. Delimiter is auto-detected.
 *
 * Every language version of a concert is listed separately and labelled with
 * its language, because questions are stored per-post: the English and French
 * versions of the same concert each carry their own set, so you can add
 * subtitles to one without touching the other. The Overview tab has a language
 * filter, and rows link across to their translated counterparts.
 *
 * @package festival-bach-understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * Register the admin menu page.
 */
function festival_interactive_video_admin_menu() {
    $concerts = get_posts( array(
        'post_type'        => 'concerts',
        'post_status'      => 'publish',
        'posts_per_page'   => -1,
        'orderby'          => 'title',
        'order'            => 'ASC',
        'suppress_filters' => true, // Explicit: every language, not just the admin's current one.
    ) );

    if ( empty( $concerts ) ) {
        return;
    }

    add_submenu_page(
        'edit.php?post_type=concerts',
        __( 'Interactive Video Questions', 'festival-bach-understrap' ),
        __( 'Interactive Questions', 'festival-bach-understrap' ),
        'edit_posts',
        'festival-import-questions',
        'festival_interactive_video_admin_page'
    );
}
add_action( 'admin_menu', 'festival_interactive_video_admin_menu' );

/**
 * Render the admin page.
 */
function festival_interactive_video_admin_page() {
    $concerts = get_posts( array(
        'post_type'        => 'concerts',
        'post_status'      => 'publish',
        'posts_per_page'   => -1,
        'orderby'          => 'title',
        'order'            => 'ASC',
        'suppress_filters' => true, // Explicit: every language, not just the admin's current one.
    ) );

    $active_tab = isset( $_GET['tab'] ) ? sanitize_key( $_GET['tab'] ) : 'overview';
    ?>
    <div class="wrap">
        <h1><?php esc_html_e( 'Interactive Video Questions', 'festival-bach-understrap' ); ?></h1>

        <h2 class="nav-tab-wrapper">
            <a href="?post_type=concerts&page=festival-import-questions&tab=overview" class="nav-tab <?php echo 'overview' === $active_tab ? 'nav-tab-active' : ''; ?>">
                <?php esc_html_e( 'Overview', 'festival-bach-understrap' ); ?>
            </a>
            <a href="?post_type=concerts&page=festival-import-questions&tab=manage" class="nav-tab <?php echo 'manage' === $active_tab ? 'nav-tab-active' : ''; ?>">
                <?php esc_html_e( 'Manage', 'festival-bach-understrap' ); ?>
            </a>
            <a href="?post_type=concerts&page=festival-import-questions&tab=csv" class="nav-tab <?php echo 'csv' === $active_tab ? 'nav-tab-active' : ''; ?>">
                <?php esc_html_e( 'CSV Import', 'festival-bach-understrap' ); ?>
            </a>
        </h2>

        <?php
        switch ( $active_tab ) {
            case 'manage':
                festival_render_manage_tab( $concerts );
                break;
            case 'csv':
                festival_render_csv_tab( $concerts );
                break;
            default:
                festival_render_overview_tab( $concerts );
                break;
        }
        ?>
    </div>
    <?php
}

// ─────────────────────────────────────────────────────────────
//  HELPER: Build concert → questions map
// ─────────────────────────────────────────────────────────────

/**
 * Get all concerts with their interactive question data.
 *
 * @param array $concerts Array of WP_Post objects.
 * @return array Associative array: post_id => [ title, enabled, idle_url, questions, count ].
 */
function festival_get_concerts_question_data( $concerts ) {
    $data = array();
    foreach ( $concerts as $c ) {
        $questions = get_field( 'interactive_questions', $c->ID );
        if ( ! is_array( $questions ) ) {
            $questions = array();
        }
        $data[ $c->ID ] = array(
            'title'          => $c->post_title,
            'lang'           => festival_get_post_language_code( $c->ID ),
            'enabled'        => (bool) get_field( 'interactive_video_enabled', $c->ID ),
            'captions'       => (bool) get_field( 'interactive_video_auto_closed_captions', $c->ID ),
            'idle_url'       => (string) get_field( 'interactive_video_idle_url', $c->ID ),
            'questions'      => $questions,
            'count'          => count( $questions ),
        );
    }
    return $data;
}

// ─────────────────────────────────────────────────────────────
//  TAB: OVERVIEW
// ─────────────────────────────────────────────────────────────

/**
 * Handle the Overview tab's "delete all visible" action.
 *
 * Wipes the `interactive_questions` field for every filtered concert. Requires a
 * valid nonce plus a typed confirmation phrase (checked server-side too,
 * in case the JS confirmation is bypassed) since this is irreversible.
 */
function festival_handle_overview_global_delete( $concerts ) {
    if ( empty( $_POST['festival_overview_nonce'] ) || ! wp_verify_nonce( $_POST['festival_overview_nonce'], 'festival_overview_actions' ) ) {
        return;
    }

    if ( empty( $_POST['festival_action'] ) || 'delete_all_visible' !== $_POST['festival_action'] ) {
        return;
    }

    if ( ! current_user_can( 'edit_others_posts' ) ) {
        printf(
            '<div class="notice notice-error is-dismissible"><p>%s</p></div>',
            esc_html__( 'You do not have permission to do that.', 'festival-bach-understrap' )
        );
        return;
    }

    $confirm_text = isset( $_POST['confirm_text'] ) ? trim( wp_unslash( $_POST['confirm_text'] ) ) : '';
    if ( 'DELETE VISIBLE' !== $confirm_text ) {
        printf(
            '<div class="notice notice-error is-dismissible"><p>%s</p></div>',
            esc_html__( 'Confirmation text did not match. No questions were deleted.', 'festival-bach-understrap' )
        );
        return;
    }

    $search_term   = isset( $_POST['overview_search'] ) ? sanitize_text_field( wp_unslash( $_POST['overview_search'] ) ) : '';
    $status_filter = isset( $_POST['overview_status'] ) ? sanitize_key( $_POST['overview_status'] ) : '';
    $lang_filter   = isset( $_POST['overview_lang'] ) ? sanitize_key( $_POST['overview_lang'] ) : '';
    $filtered      = festival_filter_overview_data(
        festival_get_concerts_question_data( $concerts ),
        $search_term,
        $status_filter,
        $lang_filter
    );

    $cleared  = 0;
    $disabled = 0;
    foreach ( array_keys( $filtered ) as $cid ) {
        $existing = get_field( 'interactive_questions', $cid );
        if ( is_array( $existing ) && ! empty( $existing ) ) {
            update_field( 'interactive_questions', array(), $cid );
            $cleared++;
        }

        // Keep the enabled flag in step with the (now empty) question set.
        if ( festival_disable_interactive_video_if_empty( $cid ) ) {
            $disabled++;
        }
    }

    printf(
        '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
        esc_html( sprintf(
            /* translators: 1: number of concerts cleared, 2: number of concerts disabled as a result */
            __( 'Deleted questions from %1$d visible concert(s), and disabled interactive video on %2$d.', 'festival-bach-understrap' ),
            $cleared,
            $disabled
        ) )
    );
}

/**
 * Apply the Overview tab's search/status/language filters to a concert data set.
 *
 * Shared by the table renderer and the "apply to all visible" bulk idle-video
 * action, so both always agree on which concerts count as "visible".
 *
 * @param array  $data          Post ID => data, as returned by festival_get_concerts_question_data().
 * @param string $search_term   Free-text title search.
 * @param string $status_filter One of '', 'active', 'inactive', 'with_questions', 'no_questions'.
 * @param string $lang_filter   Language code, or '' for all.
 * @return array Filtered post ID => data, same shape as $data.
 */
function festival_filter_overview_data( $data, $search_term, $status_filter, $lang_filter ) {
    $filtered = array();

    foreach ( $data as $post_id => $d ) {
        if ( '' !== $search_term ) {
            $haystack = mb_strtolower( $d['title'] );
            $needle   = mb_strtolower( $search_term );
            if ( false === mb_strpos( $haystack, $needle ) ) {
                continue;
            }
        }

        if ( 'active' === $status_filter && ! $d['enabled'] ) {
            continue;
        }
        if ( 'inactive' === $status_filter && $d['enabled'] ) {
            continue;
        }
        if ( 'with_questions' === $status_filter && 0 === $d['count'] ) {
            continue;
        }
        if ( 'no_questions' === $status_filter && $d['count'] > 0 ) {
            continue;
        }

        if ( '' !== $lang_filter && $d['lang'] !== $lang_filter ) {
            continue;
        }

        $filtered[ $post_id ] = $d;
    }

    return $filtered;
}

/**
 * Resolve which concerts a bulk Overview action should apply to.
 *
 * @param string $scope    'selected' (checked rows) or 'all_visible' (every
 *                          concert matching the current filters, all pages).
 * @param array  $concerts Array of WP_Post objects (every concert, all languages).
 * @return int[] Deduplicated concert post IDs.
 */
function festival_resolve_overview_bulk_targets( $scope, $concerts ) {
    if ( 'selected' === $scope ) {
        $target_ids = isset( $_POST['concert_ids'] ) ? array_map( 'intval', (array) $_POST['concert_ids'] ) : array();
    } else {
        // "All visible" is resolved server-side from the same $_GET filters the
        // table itself uses, so it covers every matching concert across all
        // pages — not just whatever happened to be on screen.
        $search_term   = isset( $_GET['s'] ) ? sanitize_text_field( wp_unslash( $_GET['s'] ) ) : '';
        $status_filter = isset( $_GET['status'] ) ? sanitize_key( $_GET['status'] ) : '';
        $lang_filter   = isset( $_GET['lang'] ) ? sanitize_key( $_GET['lang'] ) : '';

        $data       = festival_get_concerts_question_data( $concerts );
        $filtered   = festival_filter_overview_data( $data, $search_term, $status_filter, $lang_filter );
        $target_ids = array_keys( $filtered );
    }

    return array_values( array_unique( array_filter( array_map( 'intval', $target_ids ) ) ) );
}

/**
 * Handle the Overview tab's bulk actions — setting the idle video, activating/
 * deactivating, or toggling captions — for either a checked set of concerts or
 * every concert matching the current search/status/language filters.
 *
 * @param array $concerts Array of WP_Post objects (every concert, all languages).
 */
function festival_handle_overview_bulk_actions( $concerts ) {
    if ( empty( $_POST['festival_overview_nonce'] ) || ! wp_verify_nonce( $_POST['festival_overview_nonce'], 'festival_overview_actions' ) ) {
        return;
    }

    $action = isset( $_POST['festival_action'] ) ? sanitize_key( $_POST['festival_action'] ) : '';

    $known_actions = array(
        'idle_bulk_apply_selected',
        'idle_bulk_apply_all_visible',
        'status_bulk_apply_selected',
        'status_bulk_apply_all_visible',
        'captions_bulk_apply_selected',
        'captions_bulk_apply_all_visible',
    );
    if ( ! in_array( $action, $known_actions, true ) ) {
        return;
    }

    if ( ! current_user_can( 'edit_others_posts' ) ) {
        printf(
            '<div class="notice notice-error is-dismissible"><p>%s</p></div>',
            esc_html__( 'You do not have permission to do that.', 'festival-bach-understrap' )
        );
        return;
    }

    $scope      = ( false !== strpos( $action, '_all_visible' ) ) ? 'all_visible' : 'selected';
    $target_ids = festival_resolve_overview_bulk_targets( $scope, $concerts );

    if ( empty( $target_ids ) ) {
        printf(
            '<div class="notice notice-warning is-dismissible"><p>%s</p></div>',
            esc_html__( 'No concerts were selected — nothing was changed.', 'festival-bach-understrap' )
        );
        return;
    }

    $updated = 0;
    $message = '';

    if ( 0 === strpos( $action, 'idle_bulk_' ) ) {

        // Blank input clears the field; anything else is sanitized as a URL.
        $idle_url_raw = isset( $_POST['idle_video_url'] ) ? trim( wp_unslash( $_POST['idle_video_url'] ) ) : '';
        $idle_url     = ( '' !== $idle_url_raw ) ? esc_url_raw( $idle_url_raw ) : '';

        foreach ( $target_ids as $cid ) {
            if ( 'concerts' !== get_post_type( $cid ) ) {
                continue;
            }
            update_field( 'interactive_video_idle_url', $idle_url, $cid );
            $updated++;
        }

        $message = ( '' !== $idle_url )
            ? sprintf(
                /* translators: %d: number of concerts updated */
                __( 'Set the idle video on %d concert(s).', 'festival-bach-understrap' ),
                $updated
            )
            : sprintf(
                /* translators: %d: number of concerts updated */
                __( 'Cleared the idle video on %d concert(s).', 'festival-bach-understrap' ),
                $updated
            );

    } elseif ( 0 === strpos( $action, 'status_bulk_' ) ) {

        // '0' is falsy in PHP, so this correctly distinguishes Activate vs Deactivate.
        $enable = ! empty( $_POST['status_value'] );

        foreach ( $target_ids as $cid ) {
            if ( 'concerts' !== get_post_type( $cid ) ) {
                continue;
            }
            update_field( 'interactive_video_enabled', $enable, $cid );
            $updated++;
        }

        $message = $enable
            ? sprintf(
                /* translators: %d: number of concerts updated */
                __( 'Activated interactive video on %d concert(s).', 'festival-bach-understrap' ),
                $updated
            )
            : sprintf(
                /* translators: %d: number of concerts updated */
                __( 'Deactivated interactive video on %d concert(s).', 'festival-bach-understrap' ),
                $updated
            );

    } elseif ( 0 === strpos( $action, 'captions_bulk_' ) ) {

        $captions_on = ! empty( $_POST['captions_value'] );

        foreach ( $target_ids as $cid ) {
            if ( 'concerts' !== get_post_type( $cid ) ) {
                continue;
            }
            update_field( 'interactive_video_auto_closed_captions', $captions_on, $cid );
            $updated++;
        }

        $message = $captions_on
            ? sprintf(
                /* translators: %d: number of concerts updated */
                __( 'Turned on captions for %d concert(s).', 'festival-bach-understrap' ),
                $updated
            )
            : sprintf(
                /* translators: %d: number of concerts updated */
                __( 'Turned off captions for %d concert(s).', 'festival-bach-understrap' ),
                $updated
            );
    }

    printf(
        '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
        esc_html( $message )
    );
}

/**
 * Render the Overview tab — summary table of all concerts with pagination & filtering.
 *
 * @param array $concerts Array of WP_Post objects.
 */
function festival_render_overview_tab( $concerts ) {
    festival_handle_overview_global_delete( $concerts );
    festival_handle_overview_bulk_actions( $concerts );

    $data = festival_get_concerts_question_data( $concerts );

    // ── Compute aggregate stats (always across ALL concerts) ──
    $total_questions = 0;
    $enabled_count   = 0;
    $with_questions  = 0;

    foreach ( $data as $d ) {
        $total_questions += $d['count'];
        if ( $d['enabled'] ) {
            $enabled_count++;
        }
        if ( $d['count'] > 0 ) {
            $with_questions++;
        }
    }

    // ── Filtering ───────────────────────────────────────────
    $search_term   = isset( $_GET['s'] ) ? sanitize_text_field( wp_unslash( $_GET['s'] ) ) : '';
    $status_filter = isset( $_GET['status'] ) ? sanitize_key( $_GET['status'] ) : '';
    $lang_filter   = isset( $_GET['lang'] ) ? sanitize_key( $_GET['lang'] ) : '';

    $filtered = festival_filter_overview_data( $data, $search_term, $status_filter, $lang_filter );

    // ── Pagination ──────────────────────────────────────────
    $per_page     = 20;
    $total_items  = count( $filtered );
    $total_pages  = max( 1, (int) ceil( $total_items / $per_page ) );
    $current_page = isset( $_GET['paged'] ) ? max( 1, min( $total_pages, intval( $_GET['paged'] ) ) ) : 1;
    $offset       = ( $current_page - 1 ) * $per_page;

    $paged_data = array_slice( $filtered, $offset, $per_page, true );

    // ── Build base URL for links ────────────────────────────
    $base_url = add_query_arg(
        array_filter( array(
            'post_type' => 'concerts',
            'page'      => 'festival-import-questions',
            'tab'       => 'overview',
            's'         => $search_term ?: null,
            'status'    => $status_filter ?: null,
            'lang'      => $lang_filter ?: null,
        ) ),
        admin_url( 'edit.php' )
    );
    ?>
    <div style="margin: 20px 0; display: flex; gap: 24px;">
        <div style="background: #fff; border: 1px solid #c3c4c7; padding: 16px 24px; min-width: 140px;">
            <div style="font-size: 28px; font-weight: 700; color: #2271b1;"><?php echo count( $concerts ); ?></div>
            <div style="color: #646970;"><?php esc_html_e( 'Total Concerts', 'festival-bach-understrap' ); ?></div>
        </div>
        <div style="background: #fff; border: 1px solid #c3c4c7; padding: 16px 24px; min-width: 140px;">
            <div style="font-size: 28px; font-weight: 700; color: #2271b1;"><?php echo esc_html( $with_questions ); ?></div>
            <div style="color: #646970;"><?php esc_html_e( 'With Questions', 'festival-bach-understrap' ); ?></div>
        </div>
        <div style="background: #fff; border: 1px solid #c3c4c7; padding: 16px 24px; min-width: 140px;">
            <div style="font-size: 28px; font-weight: 700; color: #2271b1;"><?php echo esc_html( $total_questions ); ?></div>
            <div style="color: #646970;"><?php esc_html_e( 'Total Questions', 'festival-bach-understrap' ); ?></div>
        </div>
        <div style="background: #fff; border: 1px solid #c3c4c7; padding: 16px 24px; min-width: 140px;">
            <div style="font-size: 28px; font-weight: 700; color: #00a32a;"><?php echo esc_html( $enabled_count ); ?></div>
            <div style="color: #646970;"><?php esc_html_e( 'Enabled', 'festival-bach-understrap' ); ?></div>
        </div>
    </div>

    <?php // ── Danger zone: delete all questions across every concert ── ?>
    <form method="post" action="" id="festival-global-delete-form" style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
        <?php wp_nonce_field( 'festival_overview_actions', 'festival_overview_nonce' ); ?>
        <input type="hidden" name="festival_action" value="delete_all_visible" />
        <input type="hidden" name="overview_search" value="<?php echo esc_attr( $search_term ); ?>" />
        <input type="hidden" name="overview_status" value="<?php echo esc_attr( $status_filter ); ?>" />
        <input type="hidden" name="overview_lang" value="<?php echo esc_attr( $lang_filter ); ?>" />
        <input type="hidden" name="confirm_text" id="festival-global-delete-confirm" value="" />
        <button type="button" class="button" id="festival-global-delete-btn" style="color: #b32d2e; border-color: #b32d2e;">
            <?php esc_html_e( 'Delete All Visible', 'festival-bach-understrap' ); ?>
        </button>
        <span style="color: #646970; font-size: 12px;">
            <?php esc_html_e( 'Permanently removes questions from every concert matching the current filters. Cannot be undone.', 'festival-bach-understrap' ); ?>
        </span>
    </form>

    <?php // ── Bulk actions: selected rows, or every row matching the current filters ── ?>
    <form method="post" action="" id="festival-idle-bulk-form" style="margin-bottom: 16px; padding: 12px 16px; background: #fff; border: 1px solid #c3c4c7;">
        <?php wp_nonce_field( 'festival_overview_actions', 'festival_overview_nonce' ); ?>
        <input type="hidden" name="festival_action" id="festival-idle-bulk-action" value="" />

        <div style="font-weight: 600; margin-bottom: 8px;"><?php esc_html_e( 'Bulk Actions', 'festival-bach-understrap' ); ?></div>

        <?php // Row: Idle video ── ?>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;">
            <label for="festival-idle-bulk-url" style="min-width: 90px;">
                <?php esc_html_e( 'Idle Video:', 'festival-bach-understrap' ); ?>
            </label>
            <input type="url" name="idle_video_url" id="festival-idle-bulk-url"
                   placeholder="<?php esc_attr_e( 'https://www.youtube.com/watch?v=… (leave blank to clear)', 'festival-bach-understrap' ); ?>"
                   style="min-width: 320px;" />
            <button type="button" class="button" id="festival-idle-apply-selected" disabled>
                <?php esc_html_e( 'Apply to Selected', 'festival-bach-understrap' ); ?>
            </button>
            <button type="button" class="button" id="festival-idle-apply-all">
                <?php
                printf(
                    /* translators: %d: number of concerts matching the current filters */
                    esc_html__( 'Apply to All Visible (%d)', 'festival-bach-understrap' ),
                    $total_items
                );
                ?>
            </button>
            <span style="color: #646970; font-size: 12px;">
                <?php esc_html_e( '(blank clears it)', 'festival-bach-understrap' ); ?>
            </span>
        </div>

        <?php // Row: Status (enable/disable) ── ?>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;">
            <label for="festival-status-bulk-select" style="min-width: 90px;">
                <?php esc_html_e( 'Status:', 'festival-bach-understrap' ); ?>
            </label>
            <select name="status_value" id="festival-status-bulk-select">
                <option value="1"><?php esc_html_e( 'Activate', 'festival-bach-understrap' ); ?></option>
                <option value="0"><?php esc_html_e( 'Deactivate', 'festival-bach-understrap' ); ?></option>
            </select>
            <button type="button" class="button" id="festival-status-apply-selected" disabled>
                <?php esc_html_e( 'Apply to Selected', 'festival-bach-understrap' ); ?>
            </button>
            <button type="button" class="button" id="festival-status-apply-all">
                <?php
                printf(
                    /* translators: %d: number of concerts matching the current filters */
                    esc_html__( 'Apply to All Visible (%d)', 'festival-bach-understrap' ),
                    $total_items
                );
                ?>
            </button>
        </div>

        <?php // Row: Captions ── ?>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <label for="festival-captions-bulk-select" style="min-width: 90px;">
                <?php esc_html_e( 'Captions:', 'festival-bach-understrap' ); ?>
            </label>
            <select name="captions_value" id="festival-captions-bulk-select">
                <option value="1"><?php esc_html_e( 'Turn On', 'festival-bach-understrap' ); ?></option>
                <option value="0"><?php esc_html_e( 'Turn Off', 'festival-bach-understrap' ); ?></option>
            </select>
            <button type="button" class="button" id="festival-captions-apply-selected" disabled>
                <?php esc_html_e( 'Apply to Selected', 'festival-bach-understrap' ); ?>
            </button>
            <button type="button" class="button" id="festival-captions-apply-all">
                <?php
                printf(
                    /* translators: %d: number of concerts matching the current filters */
                    esc_html__( 'Apply to All Visible (%d)', 'festival-bach-understrap' ),
                    $total_items
                );
                ?>
            </button>
        </div>

        <p class="description" style="margin: 10px 0 0;">
            <?php esc_html_e( '"Selected" applies to the checked rows below. "All Visible" applies to every concert matching the current search/status/language filters, across all pages — not just this page.', 'festival-bach-understrap' ); ?>
        </p>
    </form>

    <script>
    (function() {
        var btn           = document.getElementById('festival-global-delete-btn');
        var form          = document.getElementById('festival-global-delete-form');
        var confirmField  = document.getElementById('festival-global-delete-confirm');

        if (btn) {
            btn.addEventListener('click', function() {
                var typed = prompt('<?php echo esc_js( __( 'This will permanently delete interactive questions from every concert matching the current filters. This cannot be undone.\n\nType DELETE VISIBLE to confirm:', 'festival-bach-understrap' ) ); ?>');
                if (typed === null) {
                    return; // Cancelled.
                }
                if (typed.trim() !== 'DELETE VISIBLE') {
                    alert('<?php echo esc_js( __( 'Confirmation text did not match. Nothing was deleted.', 'festival-bach-understrap' ) ); ?>');
                    return;
                }
                confirmField.value = typed.trim();
                form.submit();
            });
        }
    })();
    </script>

    <?php $active_languages = festival_get_active_languages(); ?>

    <?php // ── Filter bar ─────────────────────────────────── ?>
    <form method="get" action="" style="margin-bottom: 12px; display: flex; gap: 8px; align-items: center;">
        <input type="hidden" name="post_type" value="concerts" />
        <input type="hidden" name="page" value="festival-import-questions" />
        <input type="hidden" name="tab" value="overview" />

        <input type="search" name="s" value="<?php echo esc_attr( $search_term ); ?>"
               placeholder="<?php esc_attr_e( 'Search concerts…', 'festival-bach-understrap' ); ?>"
               style="min-width: 240px;" />

        <select name="status">
            <option value=""><?php esc_html_e( 'All statuses', 'festival-bach-understrap' ); ?></option>
            <option value="active" <?php selected( $status_filter, 'active' ); ?>><?php esc_html_e( 'Active', 'festival-bach-understrap' ); ?></option>
            <option value="inactive" <?php selected( $status_filter, 'inactive' ); ?>><?php esc_html_e( 'Inactive', 'festival-bach-understrap' ); ?></option>
            <option value="with_questions" <?php selected( $status_filter, 'with_questions' ); ?>><?php esc_html_e( 'With Questions', 'festival-bach-understrap' ); ?></option>
            <option value="no_questions" <?php selected( $status_filter, 'no_questions' ); ?>><?php esc_html_e( 'No Questions', 'festival-bach-understrap' ); ?></option>
        </select>

        <?php if ( ! empty( $active_languages ) ) : ?>
            <select name="lang">
                <option value=""><?php esc_html_e( 'All languages', 'festival-bach-understrap' ); ?></option>
                <?php foreach ( $active_languages as $lang_code => $lang_info ) : ?>
                    <option value="<?php echo esc_attr( $lang_code ); ?>" <?php selected( $lang_filter, $lang_code ); ?>>
                        <?php echo esc_html( ! empty( $lang_info['translated_name'] ) ? $lang_info['translated_name'] : strtoupper( $lang_code ) ); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        <?php endif; ?>

        <button type="submit" class="button"><?php esc_html_e( 'Filter', 'festival-bach-understrap' ); ?></button>

        <?php if ( '' !== $search_term || '' !== $status_filter || '' !== $lang_filter ) : ?>
            <a href="?post_type=concerts&page=festival-import-questions&tab=overview" class="button">
                <?php esc_html_e( 'Clear', 'festival-bach-understrap' ); ?>
            </a>
        <?php endif; ?>

        <span style="margin-left: auto; color: #646970;">
            <?php
            printf(
                esc_html__( 'Showing %1$s of %2$s concerts', 'festival-bach-understrap' ),
                count( $paged_data ),
                $total_items
            );
            ?>
        </span>
    </form>

    <table class="wp-list-table widefat fixed striped" style="margin-top: 0;">
        <thead>
            <tr>
                <th style="width: 32px;">
                    <input type="checkbox" id="festival-overview-check-all" title="<?php esc_attr_e( 'Select all on this page', 'festival-bach-understrap' ); ?>" />
                </th>
                <th><?php esc_html_e( 'Concert', 'festival-bach-understrap' ); ?></th>
                <?php if ( ! empty( $active_languages ) ) : ?>
                    <th style="width: 90px;"><?php esc_html_e( 'Language', 'festival-bach-understrap' ); ?></th>
                <?php endif; ?>
                <th style="width: 100px;"><?php esc_html_e( 'Questions', 'festival-bach-understrap' ); ?></th>
                <th style="width: 100px;"><?php esc_html_e( 'Status', 'festival-bach-understrap' ); ?></th>
                <th style="width: 100px;"><?php esc_html_e( 'Idle Video', 'festival-bach-understrap' ); ?></th>
                <th style="width: 120px;"><?php esc_html_e( 'Actions', 'festival-bach-understrap' ); ?></th>
            </tr>
        </thead>
        <tbody>
            <?php if ( empty( $paged_data ) ) : ?>
                <tr>
                    <td colspan="<?php echo empty( $active_languages ) ? 7 : 8; ?>" style="text-align: center; padding: 24px; color: #646970;">
                        <?php esc_html_e( 'No concerts match your criteria.', 'festival-bach-understrap' ); ?>
                    </td>
                </tr>
            <?php else : ?>
                <?php foreach ( $paged_data as $post_id => $d ) : ?>
                    <tr>
                        <td>
                            <input type="checkbox" class="festival-overview-row-checkbox" name="concert_ids[]"
                                   value="<?php echo esc_attr( $post_id ); ?>" form="festival-idle-bulk-form" />
                        </td>
                        <td>
                            <strong><?php echo esc_html( $d['title'] ); ?></strong>
                        </td>
                        <?php if ( ! empty( $active_languages ) ) : ?>
                            <td>
                                <?php if ( '' !== $d['lang'] ) : ?>
                                    <span style="background: #f0f0f1; color: #50575e; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px;">
                                        <?php echo esc_html( strtoupper( $d['lang'] ) ); ?>
                                    </span>
                                <?php else : ?>
                                    <span style="color: #c3c4c7;">&mdash;</span>
                                <?php endif; ?>

                                <?php
                                // Link across to the same concert in its other
                                // language(s), so it's obvious the two rows are
                                // translations rather than duplicates.
                                $siblings = festival_get_concert_translations( $post_id );
                                foreach ( $siblings as $sib_lang => $sib_id ) :
                                    $sib_url = add_query_arg(
                                        array(
                                            'post_type'  => 'concerts',
                                            'page'       => 'festival-import-questions',
                                            'tab'        => 'manage',
                                            'concert_id' => $sib_id,
                                        ),
                                        admin_url( 'edit.php' )
                                    );
                                    ?>
                                    <a href="<?php echo esc_url( $sib_url ); ?>"
                                       style="font-size: 11px; text-decoration: none;"
                                       title="<?php echo esc_attr( sprintf(
                                           /* translators: %s: uppercase language code, e.g. FR */
                                           __( 'Manage the %s version of this concert', 'festival-bach-understrap' ),
                                           strtoupper( $sib_lang )
                                       ) ); ?>">
                                        &rarr; <?php echo esc_html( strtoupper( $sib_lang ) ); ?>
                                    </a>
                                <?php endforeach; ?>
                            </td>
                        <?php endif; ?>
                        <td><?php echo esc_html( $d['count'] ); ?></td>
                        <td>
                            <?php if ( $d['enabled'] ) : ?>
                                <span style="color: #00a32a; font-weight: 600;">&#9679; <?php esc_html_e( 'Active', 'festival-bach-understrap' ); ?></span>
                            <?php else : ?>
                                <span style="color: #b32d2e;">&#9679; <?php esc_html_e( 'Inactive', 'festival-bach-understrap' ); ?></span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <?php if ( ! empty( $d['idle_url'] ) ) : ?>
                                <span style="color: #00a32a;" title="<?php echo esc_attr( $d['idle_url'] ); ?>">&#10003;</span>
                            <?php else : ?>
                                <span style="color: #c3c4c7;">&mdash;</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <a href="?post_type=concerts&page=festival-import-questions&tab=manage&concert_id=<?php echo esc_attr( $post_id ); ?>" class="button button-small">
                                <?php esc_html_e( 'Manage', 'festival-bach-understrap' ); ?>
                            </a>
                            <a href="<?php echo esc_url( get_edit_post_link( $post_id ) ); ?>" class="button button-small">
                                <?php esc_html_e( 'Edit Concert', 'festival-bach-understrap' ); ?>
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>

    <?php // ── Pagination ─────────────────────────────────── ?>
    <?php if ( $total_pages > 1 ) : ?>
        <div class="tablenav" style="margin-top: 8px;">
            <div class="tablenav-pages">
                <span class="displaying-num">
                    <?php echo esc_html( sprintf( _n( '%s item', '%s items', $total_items, 'festival-bach-understrap' ), number_format_i18n( $total_items ) ) ); ?>
                </span>
                <span class="pagination-links">
                    <?php if ( $current_page > 1 ) : ?>
                        <a class="first-page button" href="<?php echo esc_url( add_query_arg( 'paged', 1, $base_url ) ); ?>">
                            <span class="screen-reader-text"><?php esc_html_e( 'First page', 'festival-bach-understrap' ); ?></span>&laquo;
                        </a>
                        <a class="prev-page button" href="<?php echo esc_url( add_query_arg( 'paged', $current_page - 1, $base_url ) ); ?>">
                            <span class="screen-reader-text"><?php esc_html_e( 'Previous page', 'festival-bach-understrap' ); ?></span>&lsaquo;
                        </a>
                    <?php else : ?>
                        <span class="tablenav-pages-navspan button disabled" aria-hidden="true">&laquo;</span>
                        <span class="tablenav-pages-navspan button disabled" aria-hidden="true">&lsaquo;</span>
                    <?php endif; ?>

                    <span class="paging-input">
                        <label for="current-page-selector" class="screen-reader-text">
                            <?php esc_html_e( 'Current Page', 'festival-bach-understrap' ); ?>
                        </label>
                        <input class="current-page" id="current-page-selector" type="text" name="paged"
                               value="<?php echo esc_attr( $current_page ); ?>" size="2"
                               aria-describedby="table-paging" style="text-align: center;" />
                        <span class="tablenav-paging-text">
                            <?php echo esc_html( sprintf( __( 'of %s', 'festival-bach-understrap' ), number_format_i18n( $total_pages ) ) ); ?>
                        </span>
                    </span>

                    <?php if ( $current_page < $total_pages ) : ?>
                        <a class="next-page button" href="<?php echo esc_url( add_query_arg( 'paged', $current_page + 1, $base_url ) ); ?>">
                            <span class="screen-reader-text"><?php esc_html_e( 'Next page', 'festival-bach-understrap' ); ?></span>&rsaquo;
                        </a>
                        <a class="last-page button" href="<?php echo esc_url( add_query_arg( 'paged', $total_pages, $base_url ) ); ?>">
                            <span class="screen-reader-text"><?php esc_html_e( 'Last page', 'festival-bach-understrap' ); ?></span>&raquo;
                        </a>
                    <?php else : ?>
                        <span class="tablenav-pages-navspan button disabled" aria-hidden="true">&rsaquo;</span>
                        <span class="tablenav-pages-navspan button disabled" aria-hidden="true">&raquo;</span>
                    <?php endif; ?>
                </span>
            </div>
        </div>
    <?php endif; ?>

    <script>
    (function() {
        var checkAll      = document.getElementById('festival-overview-check-all');
        var rowCheckboxes = document.querySelectorAll('.festival-overview-row-checkbox');
        var bulkForm      = document.getElementById('festival-idle-bulk-form');
        var bulkAction    = document.getElementById('festival-idle-bulk-action');

        if ( ! bulkForm ) {
            return;
        }

        function selectedCheckboxes() {
            return Array.prototype.filter.call( rowCheckboxes, function( cb ) { return cb.checked; } );
        }

        // Each entry wires up one bulk-action row: its "Apply to Selected" /
        // "Apply to All Visible" buttons, and a describe() function that
        // builds the confirmation message from that row's current input.
        var rows = [
            {
                applySelectedBtn: document.getElementById('festival-idle-apply-selected'),
                applyAllBtn:      document.getElementById('festival-idle-apply-all'),
                actionSelected:   'idle_bulk_apply_selected',
                actionAllVisible: 'idle_bulk_apply_all_visible',
                describe: function() {
                    var val = document.getElementById('festival-idle-bulk-url').value.trim();
                    return val
                        ? '<?php echo esc_js( __( 'Set the idle video to', 'festival-bach-understrap' ) ); ?> "' + val + '"'
                        : '<?php echo esc_js( __( 'Clear the idle video', 'festival-bach-understrap' ) ); ?>';
                }
            },
            {
                applySelectedBtn: document.getElementById('festival-status-apply-selected'),
                applyAllBtn:      document.getElementById('festival-status-apply-all'),
                actionSelected:   'status_bulk_apply_selected',
                actionAllVisible: 'status_bulk_apply_all_visible',
                describe: function() {
                    var select = document.getElementById('festival-status-bulk-select');
                    return select.value === '1'
                        ? '<?php echo esc_js( __( 'Activate interactive video', 'festival-bach-understrap' ) ); ?>'
                        : '<?php echo esc_js( __( 'Deactivate interactive video', 'festival-bach-understrap' ) ); ?>';
                }
            },
            {
                applySelectedBtn: document.getElementById('festival-captions-apply-selected'),
                applyAllBtn:      document.getElementById('festival-captions-apply-all'),
                actionSelected:   'captions_bulk_apply_selected',
                actionAllVisible: 'captions_bulk_apply_all_visible',
                describe: function() {
                    var select = document.getElementById('festival-captions-bulk-select');
                    return select.value === '1'
                        ? '<?php echo esc_js( __( 'Turn on captions', 'festival-bach-understrap' ) ); ?>'
                        : '<?php echo esc_js( __( 'Turn off captions', 'festival-bach-understrap' ) ); ?>';
                }
            }
        ];

        function refreshApplySelectedState() {
            var count = selectedCheckboxes().length;
            rows.forEach( function( row ) {
                if ( row.applySelectedBtn ) {
                    row.applySelectedBtn.disabled = ( count === 0 );
                }
            } );
        }

        if ( checkAll ) {
            checkAll.addEventListener( 'change', function() {
                rowCheckboxes.forEach( function( cb ) { cb.checked = checkAll.checked; } );
                refreshApplySelectedState();
            } );
        }

        rowCheckboxes.forEach( function( cb ) {
            cb.addEventListener( 'change', function() {
                if ( checkAll && ! cb.checked ) {
                    checkAll.checked = false;
                }
                refreshApplySelectedState();
            } );
        } );

        rows.forEach( function( row ) {
            if ( row.applySelectedBtn ) {
                row.applySelectedBtn.addEventListener( 'click', function() {
                    var count = selectedCheckboxes().length;
                    if ( count === 0 ) {
                        return;
                    }
                    var msg = row.describe() + ' <?php echo esc_js( __( 'on the', 'festival-bach-understrap' ) ); ?> ' + count + ' <?php echo esc_js( __( 'selected concert(s)?', 'festival-bach-understrap' ) ); ?>';
                    if ( confirm( msg ) ) {
                        bulkAction.value = row.actionSelected;
                        bulkForm.submit();
                    }
                } );
            }

            if ( row.applyAllBtn ) {
                row.applyAllBtn.addEventListener( 'click', function() {
                    var msg = row.describe() + ' <?php echo esc_js( __( 'on every concert matching the current search/status/language filters (all pages, not just this one)?', 'festival-bach-understrap' ) ); ?>';
                    if ( confirm( msg ) ) {
                        bulkAction.value = row.actionAllVisible;
                        bulkForm.submit();
                    }
                } );
            }
        } );

        refreshApplySelectedState();
    })();
    </script>
    <?php
}

// ─────────────────────────────────────────────────────────────
//  TAB: MANAGE (inline edit + bulk delete)
// ─────────────────────────────────────────────────────────────

/**
 * Handle manage-tab form submissions: save edits, bulk delete, toggle enable.
 */
function festival_handle_manage_actions() {
    if ( empty( $_POST['festival_manage_nonce'] ) || ! wp_verify_nonce( $_POST['festival_manage_nonce'], 'festival_manage_actions' ) ) {
        return;
    }

    $post_id = isset( $_POST['concert_id'] ) ? intval( $_POST['concert_id'] ) : 0;
    if ( ! $post_id || 'concerts' !== get_post_type( $post_id ) ) {
        return;
    }

    $action = isset( $_POST['festival_action'] ) ? sanitize_key( $_POST['festival_action'] ) : '';

    // ── Load existing questions ─────────────────────────────
    $existing = get_field( 'interactive_questions', $post_id );
    if ( ! is_array( $existing ) ) {
        $existing = array();
    }

    $message      = '';
    $message_type = 'success';

    switch ( $action ) {

        // ── Save the complete ordered question table ────────
        case 'save_edits':
            $edited = isset( $_POST['q'] ) ? $_POST['q'] : array();
            $updated_questions = array();
            if ( is_array( $edited ) ) {
                foreach ( $edited as $fields ) {
                    $question_text = isset( $fields['question'] ) ? sanitize_text_field( wp_unslash( $fields['question'] ) ) : '';
                    $video_url     = isset( $fields['video_url'] ) ? esc_url_raw( wp_unslash( $fields['video_url'] ) ) : '';
                    if ( '' === trim( $question_text ) || '' === trim( $video_url ) ) {
                        continue;
                    }
                    $updated_questions[] = array(
                        'question'  => $question_text,
                        'video_url' => $video_url,
                    );
                }
            }
            update_field( 'interactive_questions', $updated_questions, $post_id );
            $message  = sprintf(
                __( 'Questions saved in table order. Total questions: %d.', 'festival-bach-understrap' ),
                count( $updated_questions )
            );
            if ( empty( $updated_questions ) && festival_disable_interactive_video_if_empty( $post_id ) ) {
                $message .= ' ' . __( 'Interactive video was disabled because no questions remain.', 'festival-bach-understrap' );
            }
            break;

        // ── Bulk delete selected (also covers single-row delete) ──
        case 'bulk_delete':
            $delete_ids = isset( $_POST['delete_ids'] ) ? array_map( 'intval', $_POST['delete_ids'] ) : array();
            if ( ! empty( $delete_ids ) ) {
                rsort( $delete_ids ); // Delete from end to preserve indices.
                foreach ( $delete_ids as $idx ) {
                    if ( isset( $existing[ $idx ] ) ) {
                        unset( $existing[ $idx ] );
                    }
                }
                $existing = array_values( $existing ); // Re-index.
                update_field( 'interactive_questions', $existing, $post_id );
                $message = sprintf(
                    __( 'Deleted %d question(s).', 'festival-bach-understrap' ),
                    count( $delete_ids )
                );

                if ( festival_disable_interactive_video_if_empty( $post_id ) ) {
                    $message .= ' ' . __( 'No questions left, so interactive video was disabled for this concert.', 'festival-bach-understrap' );
                }
            }
            break;

        // ── Toggle enable/disable ───────────────────────────
        case 'toggle_enable':
            $current = (bool) get_field( 'interactive_video_enabled', $post_id );
            update_field( 'interactive_video_enabled', ! $current, $post_id );
            $message = $current
                ? __( 'Interactive video disabled for this concert.', 'festival-bach-understrap' )
                : __( 'Interactive video enabled for this concert.', 'festival-bach-understrap' );
            break;

        // ── Toggle captions on/off ──────────────────────────
        case 'toggle_captions':
            $current = (bool) get_field( 'interactive_video_auto_closed_captions', $post_id );
            update_field( 'interactive_video_auto_closed_captions', ! $current, $post_id );
            $message = $current
                ? __( 'Closed captions disabled for this concert.', 'festival-bach-understrap' )
                : __( 'Closed captions enabled for this concert.', 'festival-bach-understrap' );
            break;

        // ── Save the idle (looping background) video URL ─────
        case 'save_idle_video':
            $idle_url_raw = isset( $_POST['idle_video_url'] ) ? trim( wp_unslash( $_POST['idle_video_url'] ) ) : '';
            $idle_url     = ( '' !== $idle_url_raw ) ? esc_url_raw( $idle_url_raw ) : '';
            update_field( 'interactive_video_idle_url', $idle_url, $post_id );
            $message = ( '' !== $idle_url )
                ? __( 'Idle video updated.', 'festival-bach-understrap' )
                : __( 'Idle video cleared.', 'festival-bach-understrap' );
            break;

        // ── Delete all questions ────────────────────────────
        case 'delete_all':
            update_field( 'interactive_questions', array(), $post_id );
            $existing = array();
            $message  = __( 'All questions deleted.', 'festival-bach-understrap' );

            if ( festival_disable_interactive_video_if_empty( $post_id ) ) {
                $message .= ' ' . __( 'Interactive video was disabled for this concert.', 'festival-bach-understrap' );
            }
            break;
    }

    if ( $message ) {
        printf(
            '<div class="notice notice-%s is-dismissible"><p>%s</p></div>',
            esc_attr( $message_type ),
            esc_html( $message )
        );
    }
}

/**
 * Render the Manage tab — inline editable table for a selected concert.
 *
 * @param array $concerts Array of WP_Post objects.
 */
function festival_render_manage_tab( $concerts ) {
    festival_handle_manage_actions();

    // Include every concert so questions can be added to an empty concert.
    $concerts_with_questions = $concerts;

    $selected_id = isset( $_GET['concert_id'] ) ? intval( $_GET['concert_id'] ) : 0;

    // If the selected concert was just emptied out (e.g. via "Delete All"),
    // keep it selectable so the admin doesn't lose their place mid-edit.
    if ( $selected_id && 'concerts' === get_post_type( $selected_id ) ) {
        $already_listed = false;
        foreach ( $concerts_with_questions as $c ) {
            if ( (int) $c->ID === $selected_id ) {
                $already_listed = true;
                break;
            }
        }
        if ( ! $already_listed ) {
            $selected_post = get_post( $selected_id );
            if ( $selected_post ) {
                $concerts_with_questions[] = $selected_post;
            }
        }
    }

    $questions   = array();
    $enabled     = false;
    $captions    = false;
    $idle_url    = '';

    if ( $selected_id && 'concerts' === get_post_type( $selected_id ) ) {
        $raw = get_field( 'interactive_questions', $selected_id );
        if ( is_array( $raw ) ) {
            $questions = $raw;
        }
        $enabled  = (bool) get_field( 'interactive_video_enabled', $selected_id );
        $captions = (bool) get_field( 'interactive_video_auto_closed_captions', $selected_id );
        $idle_url = (string) get_field( 'interactive_video_idle_url', $selected_id );
    }
    ?>
    <form method="get" action="" style="margin: 16px 0;">
        <input type="hidden" name="post_type" value="concerts" />
        <input type="hidden" name="page" value="festival-import-questions" />
        <input type="hidden" name="tab" value="manage" />

        <label for="concert_id_select" style="font-weight: 600; margin-right: 8px;">
            <?php esc_html_e( 'Select Concert:', 'festival-bach-understrap' ); ?>
        </label>
        <select name="concert_id" id="concert_id_select" style="min-width: 400px;" onchange="this.form.submit()">
            <option value=""><?php esc_html_e( '— Choose a concert —', 'festival-bach-understrap' ); ?></option>
            <?php foreach ( $concerts_with_questions as $c ) : ?>
                <option value="<?php echo esc_attr( $c->ID ); ?>" <?php selected( $selected_id, $c->ID ); ?>>
                    <?php echo esc_html( festival_format_concert_label( $c ) ); ?>
                </option>
            <?php endforeach; ?>
        </select>
    </form>

    <?php if ( empty( $concerts_with_questions ) ) : ?>
        <p class="description"><?php esc_html_e( 'No concerts are available to manage yet.', 'festival-bach-understrap' ); ?></p>
        <?php return; ?>
    <?php endif; ?>

    <?php if ( ! $selected_id ) : ?>
        <p class="description"><?php esc_html_e( 'Select a concert above to manage its interactive questions.', 'festival-bach-understrap' ); ?></p>
        <?php return; ?>
    <?php endif; ?>

    <?php
    $concert_title    = get_the_title( $selected_id );
    $concert_lang     = festival_get_post_language_code( $selected_id );
    $concert_siblings = festival_get_concert_translations( $selected_id );
    ?>

    <div style="display: flex; align-items: center; gap: 16px; margin: 16px 0; flex-wrap: wrap;">
        <h2 style="margin: 0;"><?php echo esc_html( $concert_title ); ?></h2>
        <?php if ( '' !== $concert_lang ) : ?>
            <span style="background: #f0f0f1; color: #50575e; padding: 2px 10px; border-radius: 3px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">
                <?php echo esc_html( strtoupper( $concert_lang ) ); ?>
            </span>
        <?php endif; ?>
        <span style="font-size: 13px; color: #646970;">
            <?php echo esc_html( sprintf( __( '%d questions', 'festival-bach-understrap' ), count( $questions ) ) ); ?>
        </span>
        <?php if ( $enabled ) : ?>
            <span style="background: #edfaef; color: #00a32a; padding: 2px 10px; border-radius: 3px; font-size: 12px; font-weight: 600;">
                <?php esc_html_e( 'ACTIVE', 'festival-bach-understrap' ); ?>
            </span>
        <?php else : ?>
            <span style="background: #fcf0f1; color: #b32d2e; padding: 2px 10px; border-radius: 3px; font-size: 12px; font-weight: 600;">
                <?php esc_html_e( 'INACTIVE', 'festival-bach-understrap' ); ?>
            </span>
        <?php endif; ?>
        <?php if ( $captions ) : ?>
            <span style="background: #e8f1ff; color: #0a4b8c; padding: 2px 10px; border-radius: 3px; font-size: 12px; font-weight: 600;">
                <?php esc_html_e( 'CAPTIONS ON', 'festival-bach-understrap' ); ?>
            </span>
        <?php else : ?>
            <span style="background: #f0f0f1; color: #50575e; padding: 2px 10px; border-radius: 3px; font-size: 12px; font-weight: 600;">
                <?php esc_html_e( 'CAPTIONS OFF', 'festival-bach-understrap' ); ?>
            </span>
        <?php endif; ?>
    </div>

    <?php if ( ! empty( $concert_siblings ) ) : ?>
        <p class="description" style="margin: 0 0 16px;">
            <?php esc_html_e( 'Questions below apply to this language version only.', 'festival-bach-understrap' ); ?>
            <?php esc_html_e( 'Also available in:', 'festival-bach-understrap' ); ?>
            <?php
            $sibling_links = array();
            foreach ( $concert_siblings as $sib_lang => $sib_id ) {
                $sib_count = get_field( 'interactive_questions', $sib_id );
                $sib_count = is_array( $sib_count ) ? count( $sib_count ) : 0;
                $sib_url   = add_query_arg(
                    array(
                        'post_type'  => 'concerts',
                        'page'       => 'festival-import-questions',
                        'tab'        => 'manage',
                        'concert_id' => $sib_id,
                    ),
                    admin_url( 'edit.php' )
                );

                $sibling_links[] = sprintf(
                    '<a href="%1$s">%2$s</a>',
                    esc_url( $sib_url ),
                    esc_html( sprintf(
                        /* translators: 1: uppercase language code, e.g. FR, 2: number of questions on that version */
                        __( '%1$s (%2$d questions)', 'festival-bach-understrap' ),
                        strtoupper( $sib_lang ),
                        $sib_count
                    ) )
                );
            }
            echo wp_kses( implode( ', ', $sibling_links ), array( 'a' => array( 'href' => array() ) ) );
            ?>
        </p>
    <?php endif; ?>

    <?php if ( empty( $questions ) ) : ?>
        <p><?php esc_html_e( 'No questions yet. Add them below or use the CSV Import tab.', 'festival-bach-understrap' ); ?></p>
    <?php endif; ?>

    <?php // Always show the toggle + manage form so enable/disable works even without questions. ?>
    <form method="post" action="" id="festival-manage-form">
        <?php wp_nonce_field( 'festival_manage_actions', 'festival_manage_nonce' ); ?>
        <input type="hidden" name="concert_id" value="<?php echo esc_attr( $selected_id ); ?>" />
        <input type="hidden" name="festival_action" id="festival_action" value="save_edits" />

        <div style="margin-bottom: 12px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <button type="button" class="button" id="festival-toggle-enable">
                <?php echo $enabled ? esc_html__( 'Disable', 'festival-bach-understrap' ) : esc_html__( 'Enable', 'festival-bach-understrap' ); ?>
            </button>
            <button type="button" class="button" id="festival-toggle-captions">
                <?php echo $captions ? esc_html__( 'Disable captions', 'festival-bach-understrap' ) : esc_html__( 'Enable captions', 'festival-bach-understrap' ); ?>
            </button>
        </div>

        <div style="margin-bottom: 16px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <label for="festival-idle-url" style="font-weight: 600;">
                <?php esc_html_e( 'Idle Video (looping background):', 'festival-bach-understrap' ); ?>
            </label>
            <input type="url" name="idle_video_url" id="festival-idle-url"
                   value="<?php echo esc_attr( $idle_url ); ?>"
                   placeholder="https://www.youtube.com/watch?v=..."
                   class="regular-text" style="min-width: 360px;" />
            <button type="button" class="button" id="festival-save-idle-video">
                <?php esc_html_e( 'Save Idle Video', 'festival-bach-understrap' ); ?>
            </button>
        </div>

        <table class="wp-list-table widefat fixed striped" id="festival-questions-table">
            <thead>
                <tr>
                    <th style="width: 60px;">#</th>
                    <th><?php esc_html_e( 'Question', 'festival-bach-understrap' ); ?></th>
                    <th><?php esc_html_e( 'Video URL', 'festival-bach-understrap' ); ?></th>
                    <th style="width: 150px;"><?php esc_html_e( 'Order', 'festival-bach-understrap' ); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ( $questions as $index => $q ) : ?>
                    <tr data-index="<?php echo esc_attr( $index ); ?>">
                        <td><?php echo esc_html( $index + 1 ); ?></td>
                        <td>
                            <input type="text"
                                   name="q[<?php echo esc_attr( $index ); ?>][question]"
                                   value="<?php echo esc_attr( isset( $q['question'] ) ? $q['question'] : '' ); ?>"
                                   class="regular-text"
                                   style="width: 100%;" />
                        </td>
                        <td>
                            <input type="url"
                                   name="q[<?php echo esc_attr( $index ); ?>][video_url]"
                                   value="<?php echo esc_attr( isset( $q['video_url'] ) ? $q['video_url'] : '' ); ?>"
                                   class="regular-text"
                                   style="width: 100%;" />
                        </td>
                        <td>
                            <button type="button" class="button button-small festival-move-up" title="<?php esc_attr_e( 'Move up', 'festival-bach-understrap' ); ?>">&uarr;</button>
                            <button type="button" class="button button-small festival-move-down" title="<?php esc_attr_e( 'Move down', 'festival-bach-understrap' ); ?>">&darr;</button>
                            <button type="button" class="button button-small festival-remove-row" style="color: #b32d2e;" title="<?php esc_attr_e( 'Remove question', 'festival-bach-understrap' ); ?>">&times;</button>
                        </td>
                    </tr>
                <?php endforeach; ?>
                <tr class="festival-question-row-new">
                    <td>+</td>
                    <td><input type="text" name="q[new][question]" class="regular-text" style="width: 100%;" placeholder="<?php esc_attr_e( 'Add a question', 'festival-bach-understrap' ); ?>" /></td>
                    <td><input type="url" name="q[new][video_url]" class="regular-text" style="width: 100%;" placeholder="<?php esc_attr_e( 'Response video URL', 'festival-bach-understrap' ); ?>" /></td>
                    <td></td>
                </tr>
            </tbody>
        </table>

        <p>
            <button type="button" class="button" id="festival-add-question-row">
                <?php esc_html_e( 'Add row', 'festival-bach-understrap' ); ?>
            </button>
        </p>

        <p class="submit" style="margin-top: 16px;">
            <button type="submit" class="button button-primary" id="festival-save-edits">
                <?php esc_html_e( 'Save Questions', 'festival-bach-understrap' ); ?>
            </button>
        </p>
    </form>

    <style>
        #festival-questions-table input[type="text"],
        #festival-questions-table input[type="url"] {
            border: 1px solid transparent;
            background: transparent;
            transition: border-color 0.2s, background 0.2s;
        }
        #festival-questions-table input[type="text"]:focus,
        #festival-questions-table input[type="url"]:focus {
            border-color: #2271b1;
            background: #fff;
        }
        #festival-questions-table tr:hover input[type="text"],
        #festival-questions-table tr:hover input[type="url"] {
            border-color: #dcdcde;
            background: #fff;
        }
        #festival-questions-table tr.modified td {
            background-color: #f6f7f7 !important;
        }
    </style>

    <script>
    (function() {
        var form   = document.getElementById('festival-manage-form');
        var action = document.getElementById('festival_action');

        // ── Toggle Enable/Disable (always available) ────────
        var toggleBtn = document.getElementById('festival-toggle-enable');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                action.value = 'toggle_enable';
                form.submit();
            });
        }

        var captionsToggleBtn = document.getElementById('festival-toggle-captions');
        if (captionsToggleBtn) {
            captionsToggleBtn.addEventListener('click', function() {
                action.value = 'toggle_captions';
                form.submit();
            });
        }

        var saveIdleBtn = document.getElementById('festival-save-idle-video');
        if (saveIdleBtn) {
            saveIdleBtn.addEventListener('click', function() {
                action.value = 'save_idle_video';
                form.submit();
            });
        }

        // ── Remove rows; the next save writes the remaining table order ──
        form.addEventListener('click', function(event) {
            if ( event.target.classList.contains('festival-remove-row') ) {
                event.preventDefault();
                var row = event.target.closest('tr');
                if ( row ) {
                    row.remove();
                }
            }
        });

        var saveEdits = document.getElementById('festival-save-edits');
        var table = document.getElementById('festival-questions-table');
        var addRowButton = document.getElementById('festival-add-question-row');
        var rowIndex = <?php echo count( $questions ) + 1; ?>;

        if ( addRowButton && table ) {
            addRowButton.addEventListener('click', function() {
                var newRow = table.querySelector('.festival-question-row-new');
                var row = document.createElement('tr');
                row.className = 'festival-question-row-new';
                row.innerHTML =
                    '<td>+</td>' +
                    '<td><input type="text" name="q[new_' + rowIndex + '][question]" class="regular-text" style="width:100%;" placeholder="<?php echo esc_js( __( 'Add a question', 'festival-bach-understrap' ) ); ?>" /></td>' +
                    '<td><input type="url" name="q[new_' + rowIndex + '][video_url]" class="regular-text" style="width:100%;" placeholder="<?php echo esc_js( __( 'Response video URL', 'festival-bach-understrap' ) ); ?>" /></td>' +
                    '<td></td>';
                newRow.parentNode.insertBefore(row, newRow);
                rowIndex++;
            });
        }

        if ( table ) {
            table.addEventListener('click', function(event) {
                var row = event.target.closest('tbody tr');
                if ( ! row || row.classList.contains('festival-question-row-new') ) {
                    return;
                }
                if ( event.target.classList.contains('festival-remove-row') ) {
                    row.remove();
                } else if ( event.target.classList.contains('festival-move-up') && row.previousElementSibling && ! row.previousElementSibling.classList.contains('festival-question-row-new') ) {
                    row.parentNode.insertBefore(row, row.previousElementSibling);
                } else if ( event.target.classList.contains('festival-move-down') && row.nextElementSibling && ! row.nextElementSibling.classList.contains('festival-question-row-new') ) {
                    row.parentNode.insertBefore(row.nextElementSibling, row);
                }
            });
        }

        if ( saveEdits ) {
            saveEdits.addEventListener('click', function(event) {
                event.preventDefault();
                action.value = 'save_edits';
                form.submit();
            });
        }
    })();
    </script>
    <?php
}

// ─────────────────────────────────────────────────────────────
//  TAB: BULK ADD
// ─────────────────────────────────────────────────────────────

/**
 * Process bulk-add form submission.
 */
function festival_handle_bulk_add() {
    if ( empty( $_POST['festival_bulk_nonce'] ) || ! wp_verify_nonce( $_POST['festival_bulk_nonce'], 'festival_bulk_add' ) ) {
        return;
    }

    $post_id = isset( $_POST['concert_id'] ) ? intval( $_POST['concert_id'] ) : 0;
    if ( ! $post_id || 'concerts' !== get_post_type( $post_id ) ) {
        return;
    }

    $questions_raw = isset( $_POST['questions'] ) ? $_POST['questions'] : array();
    if ( ! is_array( $questions_raw ) || empty( $questions_raw ) ) {
        return;
    }

    $questions = array();
    foreach ( $questions_raw as $q ) {
        // Match the inline-edit handler's sanitizing: without wp_unslash() an
        // apostrophe would be stored as \'.
        $question_text = isset( $q['question'] ) ? sanitize_text_field( wp_unslash( $q['question'] ) ) : '';
        $video_url     = isset( $q['video_url'] ) ? esc_url_raw( wp_unslash( $q['video_url'] ) ) : '';

        if ( '' === trim( $question_text ) || '' === trim( $video_url ) ) {
            continue;
        }

        $questions[] = array(
            'question'  => $question_text,
            'video_url' => $video_url,
        );
    }

    $result = festival_append_questions_to_concert( $post_id, $questions );

    $concert_title = get_the_title( $post_id );
    $message       = sprintf(
        __( 'Added %d new question(s) to "%s". Total questions: %d.', 'festival-bach-understrap' ),
        $result['added'],
        $concert_title,
        $result['total']
    );

    printf(
        '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
        esc_html( $message )
    );
}

/**
 * Render the "Bulk Add" tab.
 *
 * @param array $concerts Array of WP_Post objects.
 */
function festival_render_bulk_tab( $concerts ) {
    festival_handle_bulk_add();
    ?>
    <form method="post" action="" id="festival-bulk-form">
        <?php wp_nonce_field( 'festival_bulk_add', 'festival_bulk_nonce' ); ?>

        <table class="form-table" role="presentation">
            <tr>
                <th scope="row">
                    <label for="concert_id"><?php esc_html_e( 'Select Concert', 'festival-bach-understrap' ); ?></label>
                </th>
                <td>
                    <select name="concert_id" id="concert_id" style="min-width: 400px;" required>
                        <option value=""><?php esc_html_e( '— Choose a concert —', 'festival-bach-understrap' ); ?></option>
                        <?php foreach ( $concerts as $c ) : ?>
                            <option value="<?php echo esc_attr( $c->ID ); ?>">
                                <?php echo esc_html( festival_format_concert_label( $c ) ); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                    <p class="description">
                        <?php esc_html_e( 'Questions will be appended to this concert only. Translated versions are listed separately with their language in brackets — adding questions to the English version does not affect the French one, and vice versa.', 'festival-bach-understrap' ); ?>
                    </p>
                </td>
            </tr>
        </table>

        <h3><?php esc_html_e( 'Questions', 'festival-bach-understrap' ); ?></h3>

        <div id="festival-questions-container">
            <div class="festival-question-row" style="margin-bottom: 12px; display: flex; gap: 12px; align-items: flex-start;">
                <div style="flex: 1;">
                    <label style="display: block; font-weight: 600; margin-bottom: 4px;">
                        <?php esc_html_e( 'Question', 'festival-bach-understrap' ); ?>
                    </label>
                    <input type="text" name="questions[0][question]" class="regular-text" style="width: 100%;" placeholder="<?php esc_attr_e( 'e.g. How did Bach influence modern music?', 'festival-bach-understrap' ); ?>" />
                </div>
                <div style="flex: 1;">
                    <label style="display: block; font-weight: 600; margin-bottom: 4px;">
                        <?php esc_html_e( 'Video URL', 'festival-bach-understrap' ); ?>
                    </label>
                    <input type="url" name="questions[0][video_url]" class="regular-text" style="width: 100%;" placeholder="<?php esc_attr_e( 'https://www.youtube.com/watch?v=...', 'festival-bach-understrap' ); ?>" />
                </div>
                <div style="padding-top: 24px;">
                    <button type="button" class="button festival-remove-row" style="color: #a00;" title="<?php esc_attr_e( 'Remove row', 'festival-bach-understrap' ); ?>">&times;</button>
                </div>
            </div>
        </div>

        <p>
            <button type="button" class="button" id="festival-add-row">
                + <?php esc_html_e( 'Add another question', 'festival-bach-understrap' ); ?>
            </button>
        </p>

        <p class="submit">
            <button type="submit" class="button button-primary">
                <?php esc_html_e( 'Import Questions', 'festival-bach-understrap' ); ?>
            </button>
        </p>
    </form>

    <style>
        .festival-question-row { transition: opacity 0.2s; }
        .festival-question-row.removing { opacity: 0.4; }
    </style>

    <script>
    (function() {
        var container = document.getElementById('festival-questions-container');
        var addBtn    = document.getElementById('festival-add-row');
        var rowCount  = 1;

        addBtn.addEventListener('click', function() {
            var div = document.createElement('div');
            div.className = 'festival-question-row';
            div.style.marginBottom = '12px';
            div.style.display = 'flex';
            div.style.gap = '12px';
            div.style.alignItems = 'flex-start';
            div.innerHTML =
                '<div style="flex:1;">' +
                    '<input type="text" name="questions[' + rowCount + '][question]" class="regular-text" style="width:100%;" placeholder="<?php echo esc_js( __( 'e.g. How did Bach influence modern music?', 'festival-bach-understrap' ) ); ?>" />' +
                '</div>' +
                '<div style="flex:1;">' +
                    '<input type="url" name="questions[' + rowCount + '][video_url]" class="regular-text" style="width:100%;" placeholder="<?php echo esc_js( __( 'https://www.youtube.com/watch?v=...', 'festival-bach-understrap' ) ); ?>" />' +
                '</div>' +
                '<div style="padding-top:0;">' +
                    '<button type="button" class="button festival-remove-row" style="color:#a00;" title="<?php echo esc_js( __( 'Remove row', 'festival-bach-understrap' ) ); ?>">&times;</button>' +
                '</div>';
            container.appendChild(div);
            rowCount++;
        });

        container.addEventListener('click', function(e) {
            if (e.target.classList.contains('festival-remove-row')) {
                var row = e.target.closest('.festival-question-row');
                if (container.querySelectorAll('.festival-question-row').length > 1) {
                    row.classList.add('removing');
                    setTimeout(function() { row.remove(); }, 200);
                } else {
                    row.querySelectorAll('input').forEach(function(inp) { inp.value = ''; });
                }
            }
        });
    })();
    </script>
    <?php
}

// ─────────────────────────────────────────────────────────────
//  TAB: CSV IMPORT
// ─────────────────────────────────────────────────────────────

/**
 * Process CSV paste form submission.
 */
function festival_handle_csv_import() {
    if ( empty( $_POST['festival_csv_nonce'] ) || ! wp_verify_nonce( $_POST['festival_csv_nonce'], 'festival_csv_import' ) ) {
        return;
    }

    $csv_raw = isset( $_POST['csv_data'] ) ? trim( wp_unslash( $_POST['csv_data'] ) ) : '';
    if ( empty( $csv_raw ) ) {
        return;
    }

    $concerts_query = new WP_Query( array(
        'post_type'        => 'concerts',
        'post_status'      => 'publish',
        'posts_per_page'   => -1,
        'orderby'          => 'title',
        'order'            => 'ASC',
        'suppress_filters' => true, // Explicit: we want every language, not just the current one.
    ) );

    $lookup      = festival_build_concert_lookup( $concerts_query->have_posts() ? $concerts_query->posts : array() );
    $concert_map = $lookup['concert_map'];
    $id_map      = $lookup['id_map'];

    $rows      = explode( "\n", $csv_raw );
    $delimiter = festival_detect_csv_delimiter( rtrim( $rows[0], "\r" ) );
    $header    = str_getcsv( rtrim( array_shift( $rows ), "\r" ), $delimiter );
    $col_concert   = 0;
    $col_question  = null;
    $col_video_url = null;
    $col_lang      = null; // Optional — restricts matching to one language when present.

    foreach ( $header as $idx => $col ) {
        $col_clean = trim( $col );
        if ( stripos( $col_clean, 'question' ) !== false ) {
            $col_question = $idx;
        }
        if ( stripos( $col_clean, 'url of video' ) !== false || stripos( $col_clean, 'video render' ) !== false || stripos( $col_clean, 'video_url' ) !== false || stripos( $col_clean, 'video url' ) !== false ) {
            $col_video_url = $idx;
        }
        if ( stripos( $col_clean, 'lang' ) !== false ) {
            $col_lang = $idx;
        }
    }

    if ( null === $col_question || null === $col_video_url ) {
        // No recognizable header — treat that first line as data and fall back
        // to positional columns. A language column can't be located that way,
        // so matching stays language-agnostic.
        $col_question  = 1;
        $col_video_url = count( $header ) - 1;
        $col_lang      = null;
        array_unshift( $rows, implode( $delimiter, $header ) );
    }

    $expected_cols = count( $header );
    $concerts_data = array();
    $row_warnings  = array();
    $data_row_num  = 0;

    foreach ( $rows as $line ) {
        $line = trim( $line );
        if ( empty( $line ) ) {
            continue;
        }
        $data_row_num++;

        $row = str_getcsv( $line, $delimiter );

        $concert_name = isset( $row[ $col_concert ] ) ? trim( $row[ $col_concert ], " \t\n\r\0\x0B\"'" ) : '';
        $question     = isset( $row[ $col_question ] ) ? trim( $row[ $col_question ] ) : '';
        $video_url    = isset( $row[ $col_video_url ] ) ? trim( $row[ $col_video_url ] ) : '';
        $lang_raw     = ( null !== $col_lang && isset( $row[ $col_lang ] ) ) ? trim( $row[ $col_lang ] ) : '';
        $lang_code    = ( '' !== $lang_raw ) ? festival_resolve_language_code( $lang_raw ) : '';

        $issues = festival_validate_csv_row( $row, $expected_cols, $video_url );

        if ( '' !== $lang_raw && '' === $lang_code ) {
            $issues[] = sprintf(
                /* translators: %s: unrecognized value found in the language column */
                __( 'unrecognized language "%s" — imported without a language restriction', 'festival-bach-understrap' ),
                $lang_raw
            );
        }

        if ( ! empty( $issues ) ) {
            $row_warnings[] = array(
                'row'      => $data_row_num,
                'concert'  => $concert_name ?: __( '(blank)', 'festival-bach-understrap' ),
                'messages' => $issues,
            );
        }

        if ( empty( $concert_name ) || empty( $question ) || empty( $video_url ) ) {
            continue;
        }

        // Group by name *and* language: when a row names a language, that
        // pins it to one version, so subtitles meant for the French concert
        // don't land on the English one.
        $group_key = $concert_name . "\x00" . $lang_code;

        if ( ! isset( $concerts_data[ $group_key ] ) ) {
            $concerts_data[ $group_key ] = array(
                'name'      => $concert_name,
                'lang'      => $lang_code,
                'questions' => array(),
            );
        }
        $concerts_data[ $group_key ]['questions'][] = array(
            'question'  => $question,
            'video_url' => $video_url,
        );
    }

    $total_added     = 0;
    $written_posts   = array();
    $mirrored_posts  = array();
    $unmatched_names = array();

    foreach ( $concerts_data as $group ) {
        $csv_name  = $group['name'];
        $questions = $group['questions'];

        $post = festival_find_concert( $csv_name, $concert_map, $id_map, $group['lang'] );

        if ( ! $post ) {
            $unmatched_names[] = ( '' !== $group['lang'] )
                ? sprintf( '%s (%s)', $csv_name, strtoupper( $group['lang'] ) )
                : $csv_name;
            continue;
        }

        // Unless the row pinned a language, mirror the same questions onto
        // every translation of the matched concert, so the interactive answers
        // exist on both the EN and FR version of the concert.
        $targets = festival_resolve_import_targets( $post->ID, '' === $group['lang'] );

        foreach ( $targets as $target_id ) {
            $result = festival_append_questions_to_concert( $target_id, $questions );

            if ( $result['added'] > 0 ) {
                $total_added                 += $result['added'];
                $written_posts[ $target_id ]  = true;

                if ( (int) $target_id !== (int) $post->ID ) {
                    $mirrored_posts[ $target_id ] = true;
                }
            }
        }
    }

    $message = sprintf(
        __( 'Imported %d question(s) across %d concert(s).', 'festival-bach-understrap' ),
        $total_added,
        count( $written_posts )
    );

    if ( ! empty( $mirrored_posts ) ) {
        $message .= ' ' . sprintf(
            /* translators: %d: number of translated concert versions that also received the questions */
            __( 'This included %d translated version(s) of the matched concerts — note the question text was copied as-is, so it may still need translating.', 'festival-bach-understrap' ),
            count( $mirrored_posts )
        );
    }

    if ( ! empty( $unmatched_names ) ) {
        $message .= ' ' . __( 'Unmatched concert names:', 'festival-bach-understrap' ) . ' ' . implode( ', ', $unmatched_names );
        printf(
            '<div class="notice notice-warning is-dismissible"><p>%s</p></div>',
            esc_html( $message )
        );
    } else {
        printf(
            '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
            esc_html( $message )
        );
    }

    if ( ! empty( $row_warnings ) ) {
        $shown     = array_slice( $row_warnings, 0, 15 );
        $remaining = count( $row_warnings ) - count( $shown );

        echo '<div class="notice notice-warning is-dismissible"><p><strong>' . esc_html( sprintf(
            /* translators: %d: number of rows flagged */
            __( '%d row(s) may have formatting issues (often an unquoted comma inside a field):', 'festival-bach-understrap' ),
            count( $row_warnings )
        ) ) . '</strong></p><ul style="margin: 0 0 8px 20px; list-style: disc;">';

        foreach ( $shown as $w ) {
            printf(
                '<li>%s</li>',
                esc_html( sprintf(
                    /* translators: 1: row number, 2: concert name found in that row, 3: warning messages */
                    __( 'Row %1$d (%2$s): %3$s', 'festival-bach-understrap' ),
                    $w['row'],
                    $w['concert'],
                    implode( '; ', $w['messages'] )
                ) )
            );
        }

        if ( $remaining > 0 ) {
            printf(
                '<li>%s</li>',
                esc_html( sprintf(
                    /* translators: %d: number of additional flagged rows not shown */
                    __( '…and %d more.', 'festival-bach-understrap' ),
                    $remaining
                ) )
            );
        }

        echo '</ul><p>' . esc_html__( 'Tip: wrap any field containing a comma in double quotes, e.g. "Bach, Prelude in C". Rows above were still imported as parsed — double-check them.', 'festival-bach-understrap' ) . '</p></div>';
    }
}

/**
 * Render the "CSV Import" tab.
 *
 * @param array $concerts Array of WP_Post objects.
 */
function festival_render_csv_tab( $concerts ) {
    festival_handle_csv_import();
    ?>
    <form method="post" action="">
        <?php wp_nonce_field( 'festival_csv_import', 'festival_csv_nonce' ); ?>

        <table class="form-table" role="presentation">
            <tr>
                <th scope="row">
                    <label for="csv_data"><?php esc_html_e( 'CSV Data', 'festival-bach-understrap' ); ?></label>
                </th>
                <td>
                    <textarea name="csv_data" id="csv_data" rows="15" class="large-text code" style="font-family: monospace;" placeholder="<?php esc_attr_e( 'Paste your CSV or TSV here...', 'festival-bach-understrap' ); ?>"></textarea>
                    <p class="description">
                        <?php esc_html_e( 'Paste data with columns: Concert Name, Question, Video URL. Header row is optional — if your header contains "Question" and "URL of video" (or similar), columns are auto-detected. If no recognizable header, the first column is concert name, second is question, last is video URL.', 'festival-bach-understrap' ); ?>
                    </p>
                    <p class="description">
                        <strong><?php esc_html_e( 'Tab-separated data is auto-detected', 'festival-bach-understrap' ); ?></strong>
                        &mdash;
                        <?php esc_html_e( 'if you copy cells directly out of Excel or Google Sheets (rather than exporting a .csv), they paste as tab-separated, which avoids comma issues entirely and is the easiest way to import.', 'festival-bach-understrap' ); ?>
                    </p>
                    <p class="description">
                        <?php esc_html_e( 'If pasting comma-separated data and a concert name or question contains a comma, wrap that field in double quotes, e.g. "Bach, Prelude in C" — otherwise the comma will be read as a new column and shift the rest of the row.', 'festival-bach-understrap' ); ?>
                    </p>
                    <?php if ( ! empty( festival_get_active_languages() ) ) : ?>
                        <p class="description">
                            <strong><?php esc_html_e( 'Translations are handled automatically', 'festival-bach-understrap' ); ?></strong>
                            &mdash;
                            <?php esc_html_e( 'each question is also added to every translated version of the matched concert, so the interactive experience works in both languages. The question text is copied as-is, so you may want to translate it afterwards on the Manage tab.', 'festival-bach-understrap' ); ?>
                        </p>
                        <p class="description">
                            <strong><?php esc_html_e( 'Optional Language column', 'festival-bach-understrap' ); ?></strong>
                            &mdash;
                            <?php esc_html_e( 'to target one language only, add a column whose header contains "Language" with a value like "en", "fr", "English" or "Français". Those rows match only that language version and are not copied to translations — use this to import a batch of French answers without touching the English version.', 'festival-bach-understrap' ); ?>
                        </p>
                    <?php endif; ?>
                </td>
            </tr>
        </table>

        <h3><?php esc_html_e( 'Preview of available concerts', 'festival-bach-understrap' ); ?></h3>
        <ul style="columns: 2; list-style: disc inside; max-height: 200px; overflow-y: auto; padding: 8px 12px; background: #f6f7f7; border: 1px solid #c3c4c7;">
            <?php foreach ( $concerts as $c ) : ?>
                <li><?php echo esc_html( festival_format_concert_label( $c ) ); ?></li>
            <?php endforeach; ?>
        </ul>

        <p class="submit">
            <button type="submit" class="button button-primary">
                <?php esc_html_e( 'Import CSV', 'festival-bach-understrap' ); ?>
            </button>
        </p>
    </form>
    <?php
}
