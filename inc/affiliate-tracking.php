<?php
/**
 * Affiliate attribution and event tracking.
 *
 * @package festival-bach-understrap
 */

defined( 'ABSPATH' ) || exit;

if ( ! defined( 'FESTIVAL_AFFILIATE_SCHEMA_VERSION' ) ) {
	define( 'FESTIVAL_AFFILIATE_SCHEMA_VERSION', '2' );
}

function festival_affiliate_table_name() {
	global $wpdb;
	return $wpdb->prefix . 'festival_affiliate_events';
}

function festival_affiliate_campaign_table_name() {
	global $wpdb;
	return $wpdb->prefix . 'festival_affiliate_campaigns';
}

function festival_affiliate_sanitize_identifier( $value ) {
	$value = is_scalar( $value ) ? sanitize_text_field( wp_unslash( $value ) ) : '';
	$value = preg_replace( '/[^A-Za-z0-9_-]/', '', $value );
	return substr( trim( (string) $value ), 0, 100 );
}

function festival_affiliate_sanitize_text_value( $value ) {
	return is_scalar( $value ) ? sanitize_text_field( wp_unslash( $value ) ) : '';
}

function festival_affiliate_sanitize_url_value( $value ) {
	return is_scalar( $value ) ? esc_url_raw( wp_unslash( $value ) ) : '';
}

function festival_affiliate_current_url() {
	$scheme = is_ssl() ? 'https://' : 'http://';
	$host   = isset( $_SERVER['HTTP_HOST'] ) ? festival_affiliate_sanitize_text_value( $_SERVER['HTTP_HOST'] ) : wp_parse_url( home_url(), PHP_URL_HOST );
	$uri    = isset( $_SERVER['REQUEST_URI'] ) ? festival_affiliate_sanitize_url_value( $_SERVER['REQUEST_URI'] ) : '/';

	return esc_url_raw( $scheme . $host . $uri );
}

function festival_affiliate_install_tables() {
	global $wpdb;

	$events_table    = festival_affiliate_table_name();
	$campaigns_table = festival_affiliate_campaign_table_name();
	$charset_collate = $wpdb->get_charset_collate();

	$events_sql = "CREATE TABLE {$events_table} (
		id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
		event_name varchar(64) NOT NULL,
		event_time datetime NOT NULL,
		session_id char(36) NOT NULL,
		affiliate_id varchar(100) NOT NULL DEFAULT '',
		campaign_id varchar(100) NOT NULL DEFAULT '',
		promo_code varchar(100) NOT NULL DEFAULT '',
		concert_id bigint(20) unsigned NOT NULL DEFAULT 0,
		question_id varchar(100) NOT NULL DEFAULT '',
		event_data longtext NOT NULL,
		PRIMARY KEY  (id),
		KEY event_time (event_time),
		KEY affiliate_event (affiliate_id,event_name),
		KEY campaign_event (campaign_id,event_name),
		KEY concert_event (concert_id,event_name),
		KEY session_event (session_id,event_name)
	) {$charset_collate};";

	$campaigns_sql = "CREATE TABLE {$campaigns_table} (
		id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
		affiliate_id varchar(100) NOT NULL,
		campaign_id varchar(100) NOT NULL,
		promo_code varchar(100) NOT NULL DEFAULT '',
		landing_page text NOT NULL,
		active tinyint(1) NOT NULL DEFAULT 1,
		created_at datetime NOT NULL,
		updated_at datetime NOT NULL,
		PRIMARY KEY  (id),
		UNIQUE KEY affiliate_campaign (affiliate_id,campaign_id),
		KEY active (active)
	) {$charset_collate};";

	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	dbDelta( $events_sql );
	dbDelta( $campaigns_sql );

	update_option( 'festival_affiliate_schema_version', FESTIVAL_AFFILIATE_SCHEMA_VERSION, false );
	festival_affiliate_migrate_option_campaigns();
}

function festival_affiliate_maybe_install_tables() {
	if ( get_option( 'festival_affiliate_schema_version' ) !== FESTIVAL_AFFILIATE_SCHEMA_VERSION ) {
		festival_affiliate_install_tables();
	}
}
add_action( 'after_switch_theme', 'festival_affiliate_install_tables' );
add_action( 'admin_init', 'festival_affiliate_maybe_install_tables' );

function festival_affiliate_migrate_option_campaigns() {
	if ( get_option( 'festival_affiliate_campaigns_migrated' ) ) {
		return;
	}

	$campaigns = get_option( 'festival_affiliate_campaigns', array() );
	if ( is_array( $campaigns ) ) {
		foreach ( $campaigns as $campaign ) {
			if ( ! is_array( $campaign ) ) {
				continue;
			}

			festival_affiliate_create_campaign(
				array(
					'affiliate_id' => $campaign['affiliate_id'] ?? '',
					'campaign_id'  => $campaign['campaign_id'] ?? '',
					'promo_code'   => $campaign['promo_code'] ?? '',
					'landing_page' => $campaign['landing_page'] ?? home_url( '/' ),
					'active'       => ! empty( $campaign['active'] ),
				)
			);
		}
	}

	update_option( 'festival_affiliate_campaigns_migrated', 1, false );
}

function festival_affiliate_normalize_campaign_data( $data ) {
	$landing_page = isset( $data['landing_page'] ) ? festival_affiliate_sanitize_url_value( $data['landing_page'] ) : '';
	$landing_page = $landing_page ? $landing_page : home_url( '/' );

	return array(
		'affiliate_id' => festival_affiliate_sanitize_identifier( $data['affiliate_id'] ?? '' ),
		'campaign_id'  => festival_affiliate_sanitize_identifier( $data['campaign_id'] ?? '' ),
		'promo_code'   => isset( $data['promo_code'] ) ? festival_affiliate_sanitize_text_value( $data['promo_code'] ) : '',
		'landing_page' => $landing_page,
		'active'       => ! empty( $data['active'] ) ? 1 : 0,
	);
}

function festival_affiliate_get_campaigns( $args = array() ) {
	global $wpdb;

	festival_affiliate_maybe_install_tables();

	$args  = wp_parse_args(
		$args,
		array(
			'affiliate_id' => '',
			'campaign_id'  => '',
			'active'       => null,
			'limit'        => 0,
			'offset'       => 0,
			'orderby'      => 'created_at',
			'order'        => 'DESC',
		)
	);
	$table = festival_affiliate_campaign_table_name();
	$where = array( '1=1' );
	$vals  = array();

	if ( '' !== $args['affiliate_id'] ) {
		$where[] = 'affiliate_id = %s';
		$vals[]  = festival_affiliate_sanitize_identifier( $args['affiliate_id'] );
	}

	if ( '' !== $args['campaign_id'] ) {
		$where[] = 'campaign_id = %s';
		$vals[]  = festival_affiliate_sanitize_identifier( $args['campaign_id'] );
	}

	if ( null !== $args['active'] ) {
		$where[] = 'active = %d';
		$vals[]  = ! empty( $args['active'] ) ? 1 : 0;
	}

	$allowed_orderby = array( 'id', 'affiliate_id', 'campaign_id', 'created_at', 'updated_at', 'active' );
	$orderby         = in_array( $args['orderby'], $allowed_orderby, true ) ? $args['orderby'] : 'created_at';
	$order           = 'ASC' === strtoupper( (string) $args['order'] ) ? 'ASC' : 'DESC';
	$sql             = "SELECT * FROM {$table} WHERE " . implode( ' AND ', $where ) . " ORDER BY {$orderby} {$order}";

	if ( absint( $args['limit'] ) > 0 ) {
		$sql   .= ' LIMIT %d OFFSET %d';
		$vals[] = absint( $args['limit'] );
		$vals[] = absint( $args['offset'] );
	}

	if ( $vals ) {
		$sql = $wpdb->prepare( $sql, $vals );
	}

	return $wpdb->get_results( $sql, ARRAY_A );
}

function festival_affiliate_get_campaign( $id ) {
	global $wpdb;

	festival_affiliate_maybe_install_tables();

	$campaign = $wpdb->get_row(
		$wpdb->prepare( 'SELECT * FROM ' . festival_affiliate_campaign_table_name() . ' WHERE id = %d', absint( $id ) ),
		ARRAY_A
	);

	return $campaign ?: null;
}

function festival_affiliate_get_campaign_by_keys( $affiliate_id, $campaign_id ) {
	global $wpdb;

	festival_affiliate_maybe_install_tables();

	$affiliate_id = festival_affiliate_sanitize_identifier( $affiliate_id );
	$campaign_id  = festival_affiliate_sanitize_identifier( $campaign_id );

	if ( '' === $affiliate_id || '' === $campaign_id ) {
		return null;
	}

	$campaign = $wpdb->get_row(
		$wpdb->prepare(
			'SELECT * FROM ' . festival_affiliate_campaign_table_name() . ' WHERE affiliate_id = %s AND campaign_id = %s',
			$affiliate_id,
			$campaign_id
		),
		ARRAY_A
	);

	return $campaign ?: null;
}

function festival_affiliate_get_valid_campaign( $affiliate_id, $campaign_id ) {
	$campaign = festival_affiliate_get_campaign_by_keys( $affiliate_id, $campaign_id );

	if ( ! $campaign || empty( $campaign['active'] ) ) {
		return null;
	}

	return $campaign;
}

function festival_affiliate_create_campaign( $data ) {
	global $wpdb;

	festival_affiliate_maybe_install_tables();

	$data = festival_affiliate_normalize_campaign_data( $data );
	if ( '' === $data['affiliate_id'] || '' === $data['campaign_id'] ) {
		return new WP_Error( 'missing_affiliate_campaign', __( 'Affiliate ID and Campaign ID are required.', 'festival-bach-understrap' ) );
	}

	if ( festival_affiliate_get_campaign_by_keys( $data['affiliate_id'], $data['campaign_id'] ) ) {
		return new WP_Error( 'duplicate_affiliate_campaign', __( 'A campaign already exists for this affiliate/campaign combination.', 'festival-bach-understrap' ) );
	}

	$now                = current_time( 'mysql', true );
	$data['created_at'] = $now;
	$data['updated_at'] = $now;

	$inserted = $wpdb->insert(
		festival_affiliate_campaign_table_name(),
		$data,
		array( '%s', '%s', '%s', '%s', '%d', '%s', '%s' )
	);

	if ( ! $inserted ) {
		return new WP_Error( 'campaign_insert_failed', __( 'Could not save the campaign.', 'festival-bach-understrap' ) );
	}

	return (int) $wpdb->insert_id;
}

function festival_affiliate_update_campaign( $id, $data ) {
	global $wpdb;

	festival_affiliate_maybe_install_tables();

	$id       = absint( $id );
	$current  = festival_affiliate_get_campaign( $id );
	$data     = festival_affiliate_normalize_campaign_data( $data );
	$existing = festival_affiliate_get_campaign_by_keys( $data['affiliate_id'], $data['campaign_id'] );

	if ( ! $current ) {
		return new WP_Error( 'campaign_not_found', __( 'Campaign not found.', 'festival-bach-understrap' ) );
	}

	if ( '' === $data['affiliate_id'] || '' === $data['campaign_id'] ) {
		return new WP_Error( 'missing_affiliate_campaign', __( 'Affiliate ID and Campaign ID are required.', 'festival-bach-understrap' ) );
	}

	if ( $existing && absint( $existing['id'] ) !== $id ) {
		return new WP_Error( 'duplicate_affiliate_campaign', __( 'A campaign already exists for this affiliate/campaign combination.', 'festival-bach-understrap' ) );
	}

	$data['updated_at'] = current_time( 'mysql', true );

	$updated = $wpdb->update(
		festival_affiliate_campaign_table_name(),
		$data,
		array( 'id' => $id ),
		array( '%s', '%s', '%s', '%s', '%d', '%s' ),
		array( '%d' )
	);

	if ( false === $updated ) {
		return new WP_Error( 'campaign_update_failed', __( 'Could not update the campaign.', 'festival-bach-understrap' ) );
	}

	return true;
}

function festival_affiliate_delete_campaign( $id ) {
	global $wpdb;

	festival_affiliate_maybe_install_tables();

	return false !== $wpdb->delete(
		festival_affiliate_campaign_table_name(),
		array( 'id' => absint( $id ) ),
		array( '%d' )
	);
}

function festival_affiliate_campaign_link( $campaign ) {
	$landing_page = ! empty( $campaign['landing_page'] ) ? $campaign['landing_page'] : home_url( '/' );

	return esc_url_raw(
		add_query_arg(
			array(
				'af'   => $campaign['affiliate_id'] ?? '',
				'camp' => $campaign['campaign_id'] ?? '',
			),
			$landing_page
		)
	);
}

function festival_affiliate_cookie_value() {
	if ( empty( $_COOKIE['festival_affiliate'] ) ) {
		return null;
	}

	$value = json_decode( rawurldecode( wp_unslash( $_COOKIE['festival_affiliate'] ) ), true );
	if ( ! is_array( $value ) ) {
		return null;
	}

	$affiliate_id = festival_affiliate_sanitize_identifier( $value['affiliate_id'] ?? '' );
	$campaign_id  = festival_affiliate_sanitize_identifier( $value['campaign_id'] ?? '' );

	if ( '' === $affiliate_id || '' === $campaign_id ) {
		return null;
	}

	return array(
		'affiliate_id' => $affiliate_id,
		'campaign_id'  => $campaign_id,
		'promo_code'   => isset( $value['promo_code'] ) ? festival_affiliate_sanitize_text_value( $value['promo_code'] ) : '',
	);
}

function festival_affiliate_current_attribution() {
	$cookie = festival_affiliate_cookie_value();
	if ( $cookie ) {
		$campaign = festival_affiliate_get_valid_campaign( $cookie['affiliate_id'], $cookie['campaign_id'] );
		if ( $campaign ) {
			$cookie['promo_code'] = festival_affiliate_sanitize_text_value( $campaign['promo_code'] );
			return $cookie;
		}
	}

	$affiliate_id = isset( $_GET['af'] ) ? festival_affiliate_sanitize_identifier( $_GET['af'] ) : '';
	$campaign_id  = isset( $_GET['camp'] ) ? festival_affiliate_sanitize_identifier( $_GET['camp'] ) : '';
	$campaign     = festival_affiliate_get_valid_campaign( $affiliate_id, $campaign_id );

	if ( ! $campaign ) {
		return null;
	}

	return array(
		'affiliate_id' => $affiliate_id,
		'campaign_id'  => $campaign_id,
		'promo_code'   => festival_affiliate_sanitize_text_value( $campaign['promo_code'] ),
	);
}

function festival_affiliate_session_id() {
	global $festival_affiliate_request_session_id;

	if ( ! empty( $festival_affiliate_request_session_id ) ) {
		return $festival_affiliate_request_session_id;
	}

	if ( ! empty( $_COOKIE['festival_affiliate_session'] ) ) {
		$session_id = festival_affiliate_sanitize_text_value( $_COOKIE['festival_affiliate_session'] );
		if ( preg_match( '/^[A-Za-z0-9-]{16,64}$/', $session_id ) ) {
			$festival_affiliate_request_session_id = $session_id;
			return $session_id;
		}
	}

	$festival_affiliate_request_session_id = wp_generate_uuid4();
	return $festival_affiliate_request_session_id;
}

function festival_affiliate_should_track_frontend() {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return false;
	}

	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return false;
	}

	return true;
}

function festival_affiliate_record_event( $event ) {
	global $wpdb;

	festival_affiliate_maybe_install_tables();

	$event_data = $event['event_data'] ?? array();
	if ( ! is_array( $event_data ) ) {
		$event_data = array();
	}

	return false !== $wpdb->insert(
		festival_affiliate_table_name(),
		array(
			'event_name'   => sanitize_key( $event['event_name'] ?? '' ),
			'event_time'   => current_time( 'mysql', true ),
			'session_id'   => festival_affiliate_sanitize_text_value( $event['session_id'] ?? '' ),
			'affiliate_id' => festival_affiliate_sanitize_identifier( $event['affiliate_id'] ?? '' ),
			'campaign_id'  => festival_affiliate_sanitize_identifier( $event['campaign_id'] ?? '' ),
			'promo_code'   => festival_affiliate_sanitize_text_value( $event['promo_code'] ?? '' ),
			'concert_id'   => absint( $event['concert_id'] ?? 0 ),
			'question_id'  => festival_affiliate_sanitize_text_value( $event['question_id'] ?? '' ),
			'event_data'   => wp_json_encode( $event_data ),
		),
		array( '%s', '%s', '%s', '%s', '%s', '%s', '%d', '%s', '%s' )
	);
}

function festival_affiliate_capture_visit() {
	if ( ! festival_affiliate_should_track_frontend() ) {
		return;
	}

	$affiliate_id = isset( $_GET['af'] ) ? festival_affiliate_sanitize_identifier( $_GET['af'] ) : '';
	$campaign_id  = isset( $_GET['camp'] ) ? festival_affiliate_sanitize_identifier( $_GET['camp'] ) : '';

	if ( '' === $affiliate_id || '' === $campaign_id ) {
		return;
	}

	$campaign = festival_affiliate_get_valid_campaign( $affiliate_id, $campaign_id );
	if ( ! $campaign ) {
		return;
	}

	$session_id  = festival_affiliate_session_id();
	$promo_code  = festival_affiliate_sanitize_text_value( $campaign['promo_code'] );
	$attribution = array(
		'affiliate_id' => $affiliate_id,
		'campaign_id'  => $campaign_id,
		'promo_code'   => $promo_code,
	);
	$expire      = time() + ( 30 * DAY_IN_SECONDS );
	$cookie_path = defined( 'COOKIEPATH' ) && COOKIEPATH ? COOKIEPATH : '/';
	$domain      = defined( 'COOKIE_DOMAIN' ) ? COOKIE_DOMAIN : '';

	setcookie( 'festival_affiliate', rawurlencode( wp_json_encode( $attribution ) ), $expire, $cookie_path, $domain, is_ssl(), true );
	setcookie( 'festival_affiliate_session', $session_id, $expire, $cookie_path, $domain, is_ssl(), true );

	festival_affiliate_record_event(
		array(
			'event_name'   => 'affiliate_click',
			'session_id'   => $session_id,
			'affiliate_id' => $affiliate_id,
			'campaign_id'  => $campaign_id,
			'promo_code'   => $promo_code,
			'event_data'   => array(
				'landing_page' => festival_affiliate_current_url(),
				'referrer'     => isset( $_SERVER['HTTP_REFERER'] ) ? festival_affiliate_sanitize_url_value( $_SERVER['HTTP_REFERER'] ) : '',
			),
		)
	);
}
add_action( 'init', 'festival_affiliate_capture_visit', 20 );

function festival_affiliate_rest_event( WP_REST_Request $request ) {
	$attribution = festival_affiliate_current_attribution();
	$event       = $request->get_json_params();
	$event       = is_array( $event ) ? $event : array();
	$event_name  = isset( $event['event'] ) ? sanitize_key( $event['event'] ) : '';
	$allowed     = array( 'interactive_video_open', 'interactive_video_started', 'interactive_video_completed', 'buy_ticket_click' );

	if ( ! $attribution || ! in_array( $event_name, $allowed, true ) ) {
		return new WP_Error( 'invalid_affiliate_event', __( 'Invalid affiliate event.', 'festival-bach-understrap' ), array( 'status' => 400 ) );
	}

	$campaign = festival_affiliate_get_valid_campaign( $attribution['affiliate_id'], $attribution['campaign_id'] );
	if ( ! $campaign ) {
		return new WP_Error( 'invalid_affiliate_campaign', __( 'Invalid affiliate campaign.', 'festival-bach-understrap' ), array( 'status' => 400 ) );
	}

	$data = isset( $event['data'] ) && is_array( $event['data'] ) ? $event['data'] : array();
	if ( isset( $data['destination'] ) ) {
		$data['destination'] = festival_affiliate_sanitize_url_value( $data['destination'] );
	}

	festival_affiliate_record_event(
		array(
			'event_name'   => $event_name,
			'session_id'   => festival_affiliate_session_id(),
			'affiliate_id' => $attribution['affiliate_id'],
			'campaign_id'  => $attribution['campaign_id'],
			'promo_code'   => festival_affiliate_sanitize_text_value( $campaign['promo_code'] ),
			'concert_id'   => isset( $event['concertId'] ) ? absint( $event['concertId'] ) : 0,
			'question_id'  => isset( $event['questionId'] ) ? festival_affiliate_sanitize_text_value( $event['questionId'] ) : '',
			'event_data'   => $data,
		)
	);

	return new WP_REST_Response( array( 'recorded' => true ), 201 );
}

function festival_affiliate_register_rest_routes() {
	register_rest_route(
		'festival-bach/v1',
		'/affiliate-event',
		array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => 'festival_affiliate_rest_event',
			'permission_callback' => function ( $request ) {
				return (bool) wp_verify_nonce( $request->get_header( 'X-WP-Nonce' ), 'wp_rest' );
			},
		)
	);
}
add_action( 'rest_api_init', 'festival_affiliate_register_rest_routes' );

function festival_enqueue_affiliate_tracking() {
	$path = get_stylesheet_directory() . '/js/affiliate-tracking.js';
	if ( ! file_exists( $path ) ) {
		return;
	}

	wp_enqueue_script( 'festival-affiliate-tracking', get_stylesheet_directory_uri() . '/js/affiliate-tracking.js', array(), filemtime( $path ), true );
	wp_localize_script(
		'festival-affiliate-tracking',
		'festivalAffiliateData',
		array(
			'endpoint'    => esc_url_raw( rest_url( 'festival-bach/v1/affiliate-event' ) ),
			'nonce'       => wp_create_nonce( 'wp_rest' ),
			'sessionId'   => festival_affiliate_session_id(),
			'attribution' => festival_affiliate_current_attribution(),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'festival_enqueue_affiliate_tracking', 25 );

function festival_affiliate_admin_menu() {
	add_management_page(
		__( 'Affiliate Tracking', 'festival-bach-understrap' ),
		__( 'Affiliate Tracking', 'festival-bach-understrap' ),
		'manage_options',
		'festival-affiliate-dashboard',
		'festival_affiliate_dashboard_page'
	);

	add_submenu_page(
		'tools.php',
		__( 'Affiliate Campaigns', 'festival-bach-understrap' ),
		__( 'Affiliate Campaigns', 'festival-bach-understrap' ),
		'manage_options',
		'festival-affiliate-campaigns',
		'festival_affiliate_campaigns_page'
	);

	add_submenu_page(
		'tools.php',
		__( 'Affiliate Events', 'festival-bach-understrap' ),
		__( 'Affiliate Events', 'festival-bach-understrap' ),
		'manage_options',
		'festival-affiliate-events',
		'festival_affiliate_events_page'
	);
}
add_action( 'admin_menu', 'festival_affiliate_admin_menu' );

function festival_affiliate_admin_url( $page, $args = array() ) {
	return add_query_arg( array_merge( array( 'page' => $page ), $args ), admin_url( 'tools.php' ) );
}

function festival_affiliate_admin_tabs( $active ) {
	$tabs = array(
		'festival-affiliate-dashboard'  => __( 'Dashboard', 'festival-bach-understrap' ),
		'festival-affiliate-campaigns' => __( 'Campaigns', 'festival-bach-understrap' ),
		'festival-affiliate-events'    => __( 'Events', 'festival-bach-understrap' ),
	);
	?>
	<nav class="nav-tab-wrapper">
		<?php foreach ( $tabs as $slug => $label ) : ?>
			<a class="nav-tab <?php echo $active === $slug ? 'nav-tab-active' : ''; ?>" href="<?php echo esc_url( festival_affiliate_admin_url( $slug ) ); ?>"><?php echo esc_html( $label ); ?></a>
		<?php endforeach; ?>
	</nav>
	<?php
}

function festival_affiliate_redirect_with_message( $page, $message, $args = array() ) {
	wp_safe_redirect(
		add_query_arg(
			array_merge(
				$args,
				array(
					'festival_affiliate_message' => rawurlencode( $message ),
				)
			),
			festival_affiliate_admin_url( $page )
		)
	);
	exit;
}

function festival_affiliate_admin_notice_from_request() {
	if ( empty( $_GET['festival_affiliate_message'] ) ) {
		return;
	}

	$message = festival_affiliate_sanitize_text_value( $_GET['festival_affiliate_message'] );
	?>
	<div class="notice notice-info is-dismissible"><p><?php echo esc_html( $message ); ?></p></div>
	<?php
}

function festival_affiliate_handle_campaign_actions() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	if ( isset( $_POST['festival_affiliate_create'] ) ) {
		check_admin_referer( 'festival_affiliate_create_campaign' );
		$result = festival_affiliate_create_campaign( $_POST );
		$message = is_wp_error( $result ) ? $result->get_error_message() : __( 'Campaign created.', 'festival-bach-understrap' );
		festival_affiliate_redirect_with_message( 'festival-affiliate-campaigns', $message );
	}

	if ( isset( $_POST['festival_affiliate_update'], $_POST['campaign_id_db'] ) ) {
		check_admin_referer( 'festival_affiliate_update_campaign_' . absint( $_POST['campaign_id_db'] ) );
		$result = festival_affiliate_update_campaign( absint( $_POST['campaign_id_db'] ), $_POST );
		$message = is_wp_error( $result ) ? $result->get_error_message() : __( 'Campaign updated.', 'festival-bach-understrap' );
		festival_affiliate_redirect_with_message( 'festival-affiliate-campaigns', $message );
	}

	if ( isset( $_GET['festival_affiliate_action'], $_GET['campaign'] ) ) {
		$action = sanitize_key( wp_unslash( $_GET['festival_affiliate_action'] ) );
		$id     = absint( $_GET['campaign'] );

		if ( 'toggle' === $action ) {
			check_admin_referer( 'festival_affiliate_toggle_campaign_' . $id );
			$campaign = festival_affiliate_get_campaign( $id );
			if ( $campaign ) {
				festival_affiliate_update_campaign(
					$id,
					array(
						'affiliate_id' => $campaign['affiliate_id'],
						'campaign_id'  => $campaign['campaign_id'],
						'promo_code'   => $campaign['promo_code'],
						'landing_page' => $campaign['landing_page'],
						'active'       => empty( $campaign['active'] ),
					)
				);
			}
			festival_affiliate_redirect_with_message( 'festival-affiliate-campaigns', __( 'Campaign status updated.', 'festival-bach-understrap' ) );
		}

		if ( 'delete' === $action ) {
			check_admin_referer( 'festival_affiliate_delete_campaign_' . $id );
			festival_affiliate_delete_campaign( $id );
			festival_affiliate_redirect_with_message( 'festival-affiliate-campaigns', __( 'Campaign deleted.', 'festival-bach-understrap' ) );
		}
	}
}
add_action( 'admin_init', 'festival_affiliate_handle_campaign_actions' );

function festival_affiliate_campaign_form( $campaign = null ) {
	$is_edit = is_array( $campaign );
	?>
	<form method="post">
		<?php
		if ( $is_edit ) {
			wp_nonce_field( 'festival_affiliate_update_campaign_' . absint( $campaign['id'] ) );
			?>
			<input type="hidden" name="campaign_id_db" value="<?php echo esc_attr( $campaign['id'] ); ?>">
			<?php
		} else {
			wp_nonce_field( 'festival_affiliate_create_campaign' );
		}
		?>
		<table class="form-table"><tbody>
			<tr>
				<th><label for="affiliate_id"><?php esc_html_e( 'Affiliate ID', 'festival-bach-understrap' ); ?></label></th>
				<td><input class="regular-text" name="affiliate_id" id="affiliate_id" required value="<?php echo esc_attr( $campaign['affiliate_id'] ?? '' ); ?>"></td>
			</tr>
			<tr>
				<th><label for="campaign_id"><?php esc_html_e( 'Campaign ID', 'festival-bach-understrap' ); ?></label></th>
				<td><input class="regular-text" name="campaign_id" id="campaign_id" required value="<?php echo esc_attr( $campaign['campaign_id'] ?? '' ); ?>"></td>
			</tr>
			<tr>
				<th><label for="promo_code"><?php esc_html_e( 'Promo code', 'festival-bach-understrap' ); ?></label></th>
				<td><input class="regular-text" name="promo_code" id="promo_code" value="<?php echo esc_attr( $campaign['promo_code'] ?? '' ); ?>"></td>
			</tr>
			<tr>
				<th><label for="landing_page"><?php esc_html_e( 'Landing page', 'festival-bach-understrap' ); ?></label></th>
				<td><input class="regular-text" type="url" name="landing_page" id="landing_page" value="<?php echo esc_attr( $campaign['landing_page'] ?? home_url( '/' ) ); ?>"></td>
			</tr>
			<tr>
				<th><?php esc_html_e( 'Active', 'festival-bach-understrap' ); ?></th>
				<td><label><input type="checkbox" name="active" value="1" <?php checked( $campaign['active'] ?? 1 ); ?>> <?php esc_html_e( 'Active', 'festival-bach-understrap' ); ?></label></td>
			</tr>
		</tbody></table>
		<p>
			<button class="button button-primary" name="<?php echo $is_edit ? 'festival_affiliate_update' : 'festival_affiliate_create'; ?>" value="1">
				<?php echo esc_html( $is_edit ? __( 'Update campaign', 'festival-bach-understrap' ) : __( 'Create campaign', 'festival-bach-understrap' ) ); ?>
			</button>
			<?php if ( $is_edit ) : ?>
				<a class="button" href="<?php echo esc_url( festival_affiliate_admin_url( 'festival-affiliate-campaigns' ) ); ?>"><?php esc_html_e( 'Cancel', 'festival-bach-understrap' ); ?></a>
			<?php endif; ?>
		</p>
	</form>
	<?php
}

function festival_affiliate_campaigns_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$edit_id       = isset( $_GET['edit'] ) ? absint( $_GET['edit'] ) : 0;
	$edit_campaign = $edit_id ? festival_affiliate_get_campaign( $edit_id ) : null;
	$campaigns     = festival_affiliate_get_campaigns( array( 'order' => 'DESC' ) );
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Affiliate Tracking', 'festival-bach-understrap' ); ?></h1>
		<?php festival_affiliate_admin_tabs( 'festival-affiliate-campaigns' ); ?>
		<?php festival_affiliate_admin_notice_from_request(); ?>

		<h2><?php echo esc_html( $edit_campaign ? __( 'Edit campaign', 'festival-bach-understrap' ) : __( 'Create campaign', 'festival-bach-understrap' ) ); ?></h2>
		<?php festival_affiliate_campaign_form( $edit_campaign ); ?>

		<h2><?php esc_html_e( 'Saved campaigns', 'festival-bach-understrap' ); ?></h2>
		<table class="widefat striped">
			<thead>
				<tr>
					<th><?php esc_html_e( 'Affiliate ID', 'festival-bach-understrap' ); ?></th>
					<th><?php esc_html_e( 'Campaign ID', 'festival-bach-understrap' ); ?></th>
					<th><?php esc_html_e( 'Promo code', 'festival-bach-understrap' ); ?></th>
					<th><?php esc_html_e( 'Landing page', 'festival-bach-understrap' ); ?></th>
					<th><?php esc_html_e( 'Status', 'festival-bach-understrap' ); ?></th>
					<th><?php esc_html_e( 'Created', 'festival-bach-understrap' ); ?></th>
					<th><?php esc_html_e( 'Updated', 'festival-bach-understrap' ); ?></th>
					<th><?php esc_html_e( 'Affiliate URL', 'festival-bach-understrap' ); ?></th>
					<th><?php esc_html_e( 'Actions', 'festival-bach-understrap' ); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php if ( $campaigns ) : ?>
					<?php foreach ( $campaigns as $campaign ) : ?>
						<?php
						$link       = festival_affiliate_campaign_link( $campaign );
						$toggle_url = wp_nonce_url(
							festival_affiliate_admin_url(
								'festival-affiliate-campaigns',
								array(
									'festival_affiliate_action' => 'toggle',
									'campaign'                  => absint( $campaign['id'] ),
								)
							),
							'festival_affiliate_toggle_campaign_' . absint( $campaign['id'] )
						);
						$delete_url = wp_nonce_url(
							festival_affiliate_admin_url(
								'festival-affiliate-campaigns',
								array(
									'festival_affiliate_action' => 'delete',
									'campaign'                  => absint( $campaign['id'] ),
								)
							),
							'festival_affiliate_delete_campaign_' . absint( $campaign['id'] )
						);
						?>
						<tr>
							<td><?php echo esc_html( $campaign['affiliate_id'] ); ?></td>
							<td><?php echo esc_html( $campaign['campaign_id'] ); ?></td>
							<td><?php echo esc_html( $campaign['promo_code'] ); ?></td>
							<td><a href="<?php echo esc_url( $campaign['landing_page'] ); ?>" target="_blank"><?php echo esc_html( $campaign['landing_page'] ); ?></a></td>
							<td><?php echo empty( $campaign['active'] ) ? esc_html__( 'Inactive', 'festival-bach-understrap' ) : esc_html__( 'Active', 'festival-bach-understrap' ); ?></td>
							<td><?php echo esc_html( get_date_from_gmt( $campaign['created_at'], 'Y-m-d H:i' ) ); ?></td>
							<td><?php echo esc_html( get_date_from_gmt( $campaign['updated_at'], 'Y-m-d H:i' ) ); ?></td>
							<td>
								<input class="regular-text" readonly value="<?php echo esc_attr( $link ); ?>">
								<button type="button" class="button festival-affiliate-copy" data-link="<?php echo esc_attr( $link ); ?>"><?php esc_html_e( 'Copy Link', 'festival-bach-understrap' ); ?></button>
							</td>
							<td>
								<a href="<?php echo esc_url( festival_affiliate_admin_url( 'festival-affiliate-campaigns', array( 'edit' => absint( $campaign['id'] ) ) ) ); ?>"><?php esc_html_e( 'Edit', 'festival-bach-understrap' ); ?></a> |
								<a href="<?php echo esc_url( $toggle_url ); ?>"><?php echo empty( $campaign['active'] ) ? esc_html__( 'Activate', 'festival-bach-understrap' ) : esc_html__( 'Deactivate', 'festival-bach-understrap' ); ?></a> |
								<a href="<?php echo esc_url( $delete_url ); ?>" onclick="return confirm('<?php echo esc_js( __( 'Delete this campaign?', 'festival-bach-understrap' ) ); ?>');"><?php esc_html_e( 'Delete', 'festival-bach-understrap' ); ?></a>
							</td>
						</tr>
					<?php endforeach; ?>
				<?php else : ?>
					<tr><td colspan="9"><?php esc_html_e( 'No affiliate campaigns yet.', 'festival-bach-understrap' ); ?></td></tr>
				<?php endif; ?>
			</tbody>
		</table>
	</div>
	<script>
		document.addEventListener('click', function (event) {
			var button = event.target.closest ? event.target.closest('.festival-affiliate-copy') : null;
			if (!button || !navigator.clipboard) return;
			navigator.clipboard.writeText(button.getAttribute('data-link') || '').then(function () {
				button.textContent = '<?php echo esc_js( __( 'Copied', 'festival-bach-understrap' ) ); ?>';
				window.setTimeout(function () {
					button.textContent = '<?php echo esc_js( __( 'Copy Link', 'festival-bach-understrap' ) ); ?>';
				}, 1500);
			});
		});
	</script>
	<?php
}

function festival_affiliate_date_range_from_request() {
	$default_start = gmdate( 'Y-m-d', strtotime( '-30 days' ) );
	$default_end   = gmdate( 'Y-m-d' );
	$start         = isset( $_GET['start_date'] ) ? festival_affiliate_sanitize_text_value( $_GET['start_date'] ) : $default_start;
	$end           = isset( $_GET['end_date'] ) ? festival_affiliate_sanitize_text_value( $_GET['end_date'] ) : $default_end;

	if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $start ) ) {
		$start = $default_start;
	}
	if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $end ) ) {
		$end = $default_end;
	}

	return array(
		'start'     => $start,
		'end'       => $end,
		'start_sql' => $start . ' 00:00:00',
		'end_sql'   => $end . ' 23:59:59',
	);
}

function festival_affiliate_filter_form( $page, $range, $extra = array() ) {
	?>
	<form method="get" style="margin: 16px 0;">
		<input type="hidden" name="page" value="<?php echo esc_attr( $page ); ?>">
		<label>
			<?php esc_html_e( 'Start date', 'festival-bach-understrap' ); ?>
			<input type="date" name="start_date" value="<?php echo esc_attr( $range['start'] ); ?>">
		</label>
		<label style="margin-left: 8px;">
			<?php esc_html_e( 'End date', 'festival-bach-understrap' ); ?>
			<input type="date" name="end_date" value="<?php echo esc_attr( $range['end'] ); ?>">
		</label>
		<?php foreach ( $extra as $key => $field ) : ?>
			<label style="margin-left: 8px;">
				<?php echo esc_html( $field['label'] ); ?>
				<input type="text" name="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $field['value'] ); ?>">
			</label>
		<?php endforeach; ?>
		<button class="button"><?php esc_html_e( 'Filter', 'festival-bach-understrap' ); ?></button>
	</form>
	<?php
}

function festival_affiliate_dashboard_page() {
	global $wpdb;

	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	festival_affiliate_maybe_install_tables();

	$table = festival_affiliate_table_name();
	$range = festival_affiliate_date_range_from_request();

	$counts = $wpdb->get_results(
		$wpdb->prepare(
			"SELECT event_name, COUNT(*) AS total FROM {$table} WHERE event_time BETWEEN %s AND %s GROUP BY event_name",
			$range['start_sql'],
			$range['end_sql']
		),
		OBJECT_K
	);

	$unique_sessions = (int) $wpdb->get_var(
		$wpdb->prepare(
			"SELECT COUNT(DISTINCT session_id) FROM {$table} WHERE event_time BETWEEN %s AND %s",
			$range['start_sql'],
			$range['end_sql']
		)
	);

	$metrics = array(
		'affiliate_click'              => __( 'Affiliate visits', 'festival-bach-understrap' ),
		'unique_sessions'             => __( 'Unique sessions', 'festival-bach-understrap' ),
		'interactive_video_open'       => __( 'Video opens', 'festival-bach-understrap' ),
		'interactive_video_started'    => __( 'Video starts', 'festival-bach-understrap' ),
		'interactive_video_completed'  => __( 'Video completions', 'festival-bach-understrap' ),
		'buy_ticket_click'            => __( 'Ticket clicks', 'festival-bach-understrap' ),
	);

	$performance = $wpdb->get_results(
		$wpdb->prepare(
			"SELECT affiliate_id, campaign_id,
				SUM(CASE WHEN event_name = 'affiliate_click' THEN 1 ELSE 0 END) AS visits,
				SUM(CASE WHEN event_name = 'interactive_video_open' THEN 1 ELSE 0 END) AS video_opens,
				SUM(CASE WHEN event_name = 'interactive_video_completed' THEN 1 ELSE 0 END) AS completions,
				SUM(CASE WHEN event_name = 'buy_ticket_click' THEN 1 ELSE 0 END) AS ticket_clicks
			FROM {$table}
			WHERE event_time BETWEEN %s AND %s
			GROUP BY affiliate_id, campaign_id
			ORDER BY visits DESC, ticket_clicks DESC",
			$range['start_sql'],
			$range['end_sql']
		),
		ARRAY_A
	);
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Affiliate Tracking', 'festival-bach-understrap' ); ?></h1>
		<?php festival_affiliate_admin_tabs( 'festival-affiliate-dashboard' ); ?>
		<?php festival_affiliate_filter_form( 'festival-affiliate-dashboard', $range ); ?>

		<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin: 16px 0;">
			<?php foreach ( $metrics as $event_name => $label ) : ?>
				<?php $value = 'unique_sessions' === $event_name ? $unique_sessions : (int) ( $counts[ $event_name ]->total ?? 0 ); ?>
				<div style="background: #fff; border: 1px solid #ccd0d4; padding: 16px;">
					<div style="font-size: 13px; color: #646970;"><?php echo esc_html( $label ); ?></div>
					<div style="font-size: 28px; font-weight: 600;"><?php echo esc_html( number_format_i18n( $value ) ); ?></div>
				</div>
			<?php endforeach; ?>
		</div>

		<h2><?php esc_html_e( 'Campaign performance', 'festival-bach-understrap' ); ?></h2>
		<table class="widefat striped">
			<thead><tr><th><?php esc_html_e( 'Affiliate', 'festival-bach-understrap' ); ?></th><th><?php esc_html_e( 'Campaign', 'festival-bach-understrap' ); ?></th><th><?php esc_html_e( 'Visits', 'festival-bach-understrap' ); ?></th><th><?php esc_html_e( 'Video Opens', 'festival-bach-understrap' ); ?></th><th><?php esc_html_e( 'Completions', 'festival-bach-understrap' ); ?></th><th><?php esc_html_e( 'Ticket Clicks', 'festival-bach-understrap' ); ?></th><th><?php esc_html_e( 'Events', 'festival-bach-understrap' ); ?></th></tr></thead>
			<tbody>
				<?php if ( $performance ) : ?>
					<?php foreach ( $performance as $row ) : ?>
						<tr>
							<td><?php echo esc_html( $row['affiliate_id'] ); ?></td>
							<td><?php echo esc_html( $row['campaign_id'] ); ?></td>
							<td><?php echo esc_html( number_format_i18n( $row['visits'] ) ); ?></td>
							<td><?php echo esc_html( number_format_i18n( $row['video_opens'] ) ); ?></td>
							<td><?php echo esc_html( number_format_i18n( $row['completions'] ) ); ?></td>
							<td><?php echo esc_html( number_format_i18n( $row['ticket_clicks'] ) ); ?></td>
							<td><a href="<?php echo esc_url( festival_affiliate_admin_url( 'festival-affiliate-events', array( 'affiliate' => $row['affiliate_id'], 'campaign' => $row['campaign_id'], 'start_date' => $range['start'], 'end_date' => $range['end'] ) ) ); ?>"><?php esc_html_e( 'View events', 'festival-bach-understrap' ); ?></a></td>
						</tr>
					<?php endforeach; ?>
				<?php else : ?>
					<tr><td colspan="7"><?php esc_html_e( 'No events found for this date range.', 'festival-bach-understrap' ); ?></td></tr>
				<?php endif; ?>
			</tbody>
		</table>
	</div>
	<?php
}

function festival_affiliate_event_data_summary( $data ) {
	$data = json_decode( (string) $data, true );
	if ( ! is_array( $data ) ) {
		return '';
	}

	$parts = array();
	foreach ( array( 'page_url', 'landing_page', 'destination', 'referrer' ) as $key ) {
		if ( ! empty( $data[ $key ] ) ) {
			$parts[] = $key . ': ' . $data[ $key ];
		}
	}

	return implode( ' | ', $parts );
}

function festival_affiliate_events_page() {
	global $wpdb;

	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	festival_affiliate_maybe_install_tables();

	$table      = festival_affiliate_table_name();
	$range      = festival_affiliate_date_range_from_request();
	$affiliate  = isset( $_GET['affiliate'] ) ? festival_affiliate_sanitize_identifier( $_GET['affiliate'] ) : '';
	$campaign   = isset( $_GET['campaign'] ) ? festival_affiliate_sanitize_identifier( $_GET['campaign'] ) : '';
	$event_type = isset( $_GET['event_type'] ) ? sanitize_key( wp_unslash( $_GET['event_type'] ) ) : '';
	$concert    = isset( $_GET['concert'] ) ? absint( $_GET['concert'] ) : 0;
	$paged      = max( 1, isset( $_GET['paged'] ) ? absint( $_GET['paged'] ) : 1 );
	$per_page   = 50;
	$where      = array( 'event_time BETWEEN %s AND %s' );
	$vals       = array( $range['start_sql'], $range['end_sql'] );
	$allowed    = array( 'affiliate_click', 'interactive_video_open', 'interactive_video_started', 'interactive_video_completed', 'buy_ticket_click' );

	if ( '' !== $affiliate ) {
		$where[] = 'affiliate_id = %s';
		$vals[]  = $affiliate;
	}
	if ( '' !== $campaign ) {
		$where[] = 'campaign_id = %s';
		$vals[]  = $campaign;
	}
	if ( in_array( $event_type, $allowed, true ) ) {
		$where[] = 'event_name = %s';
		$vals[]  = $event_type;
	}
	if ( $concert ) {
		$where[] = 'concert_id = %d';
		$vals[]  = $concert;
	}

	$where_sql = implode( ' AND ', $where );
	$total     = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$table} WHERE {$where_sql}", $vals ) );
	$pages     = max( 1, (int) ceil( $total / $per_page ) );
	$offset    = ( $paged - 1 ) * $per_page;
	$query_vals = array_merge( $vals, array( $per_page, $offset ) );
	$events     = $wpdb->get_results(
		$wpdb->prepare(
			"SELECT * FROM {$table} WHERE {$where_sql} ORDER BY event_time DESC, id DESC LIMIT %d OFFSET %d",
			$query_vals
		),
		ARRAY_A
	);
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Affiliate Tracking', 'festival-bach-understrap' ); ?></h1>
		<?php festival_affiliate_admin_tabs( 'festival-affiliate-events' ); ?>
		<form method="get" style="margin: 16px 0;">
			<input type="hidden" name="page" value="festival-affiliate-events">
			<label><?php esc_html_e( 'Start date', 'festival-bach-understrap' ); ?> <input type="date" name="start_date" value="<?php echo esc_attr( $range['start'] ); ?>"></label>
			<label><?php esc_html_e( 'End date', 'festival-bach-understrap' ); ?> <input type="date" name="end_date" value="<?php echo esc_attr( $range['end'] ); ?>"></label>
			<label><?php esc_html_e( 'Affiliate', 'festival-bach-understrap' ); ?> <input type="text" name="affiliate" value="<?php echo esc_attr( $affiliate ); ?>"></label>
			<label><?php esc_html_e( 'Campaign', 'festival-bach-understrap' ); ?> <input type="text" name="campaign" value="<?php echo esc_attr( $campaign ); ?>"></label>
			<label><?php esc_html_e( 'Event', 'festival-bach-understrap' ); ?>
				<select name="event_type">
					<option value=""><?php esc_html_e( 'All events', 'festival-bach-understrap' ); ?></option>
					<?php foreach ( $allowed as $event_name ) : ?>
						<option value="<?php echo esc_attr( $event_name ); ?>" <?php selected( $event_type, $event_name ); ?>><?php echo esc_html( $event_name ); ?></option>
					<?php endforeach; ?>
				</select>
			</label>
			<label><?php esc_html_e( 'Concert', 'festival-bach-understrap' ); ?> <input type="number" min="1" name="concert" value="<?php echo esc_attr( $concert ?: '' ); ?>"></label>
			<button class="button"><?php esc_html_e( 'Filter', 'festival-bach-understrap' ); ?></button>
		</form>

		<table class="widefat striped">
			<thead><tr><th><?php esc_html_e( 'Date/time', 'festival-bach-understrap' ); ?></th><th><?php esc_html_e( 'Event', 'festival-bach-understrap' ); ?></th><th><?php esc_html_e( 'Affiliate', 'festival-bach-understrap' ); ?></th><th><?php esc_html_e( 'Campaign', 'festival-bach-understrap' ); ?></th><th><?php esc_html_e( 'Session', 'festival-bach-understrap' ); ?></th><th><?php esc_html_e( 'Concert', 'festival-bach-understrap' ); ?></th><th><?php esc_html_e( 'Question', 'festival-bach-understrap' ); ?></th><th><?php esc_html_e( 'Data', 'festival-bach-understrap' ); ?></th></tr></thead>
			<tbody>
				<?php if ( $events ) : ?>
					<?php foreach ( $events as $event ) : ?>
						<tr>
							<td><?php echo esc_html( get_date_from_gmt( $event['event_time'], 'Y-m-d H:i:s' ) ); ?></td>
							<td><?php echo esc_html( $event['event_name'] ); ?></td>
							<td><?php echo esc_html( $event['affiliate_id'] ); ?></td>
							<td><?php echo esc_html( $event['campaign_id'] ); ?></td>
							<td><code><?php echo esc_html( $event['session_id'] ); ?></code></td>
							<td><?php echo $event['concert_id'] ? '<a href="' . esc_url( get_edit_post_link( absint( $event['concert_id'] ) ) ) . '">' . esc_html( $event['concert_id'] ) . '</a>' : ''; ?></td>
							<td><?php echo esc_html( $event['question_id'] ); ?></td>
							<td><?php echo esc_html( festival_affiliate_event_data_summary( $event['event_data'] ) ); ?></td>
						</tr>
					<?php endforeach; ?>
				<?php else : ?>
					<tr><td colspan="8"><?php esc_html_e( 'No events found.', 'festival-bach-understrap' ); ?></td></tr>
				<?php endif; ?>
			</tbody>
		</table>

		<?php if ( $pages > 1 ) : ?>
			<p>
				<?php
				echo wp_kses_post(
					paginate_links(
						array(
							'base'      => add_query_arg( 'paged', '%#%' ),
							'format'    => '',
							'current'   => $paged,
							'total'     => $pages,
							'prev_text' => __( '&laquo; Previous', 'festival-bach-understrap' ),
							'next_text' => __( 'Next &raquo;', 'festival-bach-understrap' ),
						)
					)
				);
				?>
			</p>
		<?php endif; ?>
	</div>
	<?php
}
