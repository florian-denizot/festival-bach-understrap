<?php
/**
 * Interactive Video ACF Field Registration
 *
 * Registers a clean separate ACF field group for interactive video data.
 * Data is stored under the `interactive_video` meta key, completely
 * decoupled from the existing concert group field.
 *
 * @package festival-bach-understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * Register Interactive Video ACF Field Group
 */
function festival_register_interactive_video_acf_fields() {
    if ( ! function_exists( 'acf_add_local_field_group' ) ) {
        return;
    }

    acf_add_local_field_group(
        array(
            'key'      => 'group_festival_interactive_video',
            'title'    => __( 'Interactive Video Experience', 'festival-bach-understrap' ),
            'fields'   => array(
                array(
                    'key'               => 'field_interactive_video_toggle',
                    'label'             => __( 'Enable Interactive Video', 'festival-bach-understrap' ),
                    'name'              => 'interactive_video_enabled',
                    'aria-label'        => '',
                    'type'              => 'true_false',
                    'instructions'      => __( 'Enable the interactive video experience for this concert. Shows as its own metabox section on the concert page.', 'festival-bach-understrap' ),
                    'required'          => 0,
                    'conditional_logic' => 0,
                    'wrapper'           => array(
                        'width' => '',
                        'class' => '',
                        'id'    => '',
                    ),
                    'message'           => __( 'Enable', 'festival-bach-understrap' ),
                    'default_value'     => 0,
                    'ui'                => 1,
                    'ui_on_text'        => __( 'Active', 'festival-bach-understrap' ),
                    'ui_off_text'       => __( 'Inactive', 'festival-bach-understrap' ),
                ),
                array(
                    'key'               => 'field_interactive_video_idle',
                    'label'             => __( 'Idle Video (looping background)', 'festival-bach-understrap' ),
                    'name'              => 'interactive_video_idle_url',
                    'aria-label'        => '',
                    'type'              => 'url',
                    'instructions'      => __( 'YouTube or Vimeo URL that plays on loop when no question is selected.', 'festival-bach-understrap' ),
                    'required'          => 0,
                    'conditional_logic' => array(
                        array(
                            array(
                                'field'    => 'field_interactive_video_toggle',
                                'operator' => '==',
                                'value'    => '1',
                            ),
                        ),
                    ),
                    'wrapper'           => array(
                        'width' => '',
                        'class' => '',
                        'id'    => '',
                    ),
                    'default_value' => '',
                    'placeholder'   => 'https://www.youtube.com/watch?v=...',
                ),
                array(
                    'key'               => 'field_interactive_video_captions',
                    'label'             => __( 'Auto-enable closed captions', 'festival-bach-understrap' ),
                    'name'              => 'interactive_video_auto_closed_captions',
                    'aria-label'        => '',
                    'type'              => 'true_false',
                    'instructions'      => __( 'Enable closed captions automatically when the video starts on this concert page.', 'festival-bach-understrap' ),
                    'required'          => 0,
                    'conditional_logic' => array(
                        array(
                            array(
                                'field'    => 'field_interactive_video_toggle',
                                'operator' => '==',
                                'value'    => '1',
                            ),
                        ),
                    ),
                    'wrapper'           => array(
                        'width' => '',
                        'class' => '',
                        'id'    => '',
                    ),
                    'message'           => __( 'Enable captions automatically', 'festival-bach-understrap' ),
                    'default_value'     => 0,
                    'ui'                => 1,
                    'ui_on_text'        => __( 'On', 'festival-bach-understrap' ),
                    'ui_off_text'       => __( 'Off', 'festival-bach-understrap' ),
                ),
                array(
                    'key'               => 'field_interactive_questions',
                    'label'             => __( 'Questions & Video Responses', 'festival-bach-understrap' ),
                    'name'              => 'interactive_questions',
                    'aria-label'        => '',
                    'type'              => 'repeater',
                    'instructions'      => __( 'Add questions that users can click on. Each question triggers a specific unlisted video.', 'festival-bach-understrap' ),
                    'required'          => 0,
                    'conditional_logic' => array(
                        array(
                            array(
                                'field'    => 'field_interactive_video_toggle',
                                'operator' => '==',
                                'value'    => '1',
                            ),
                        ),
                    ),
                    'wrapper'           => array(
                        'width' => '',
                        'class' => '',
                        'id'    => '',
                    ),
                    'layout'        => 'block',
                    'pagination'    => 0,
                    'min'           => 0,
                    'max'           => 0,
                    'collapsed'     => 'field_interactive_question_text',
                    'button_label'  => __( 'Add Question', 'festival-bach-understrap' ),
                    'sub_fields'    => array(
                        array(
                            'key'               => 'field_interactive_question_text',
                            'label'             => __( 'Question', 'festival-bach-understrap' ),
                            'name'              => 'question',
                            'aria-label'        => '',
                            'type'              => 'text',
                            'instructions'      => __( 'The question displayed to the user.', 'festival-bach-understrap' ),
                            'required'          => 1,
                            'conditional_logic' => 0,
                            'wrapper'           => array(
                                'width' => '50',
                                'class' => '',
                                'id'    => '',
                            ),
                            'default_value' => '',
                            'placeholder'   => 'e.g. How did Bach influence modern music?',
                        ),
                        array(
                            'key'               => 'field_interactive_question_video',
                            'label'             => __( 'Response Video URL', 'festival-bach-understrap' ),
                            'name'              => 'video_url',
                            'aria-label'        => '',
                            'type'              => 'url',
                            'instructions'      => __( 'Unlisted YouTube/Vimeo URL that plays when this question is clicked.', 'festival-bach-understrap' ),
                            'required'          => 1,
                            'conditional_logic' => 0,
                            'wrapper'           => array(
                                'width' => '50',
                                'class' => '',
                                'id'    => '',
                            ),
                            'default_value' => '',
                            'placeholder'   => 'https://www.youtube.com/watch?v=...',
                        ),
                    ),
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param'    => 'post_type',
                        'operator' => '==',
                        'value'    => 'concerts',
                    ),
                ),
            ),
            'menu_order'            => 1,
            'position'              => 'normal',
            'style'                 => 'default',
            'label_placement'       => 'top',
            'instruction_placement' => 'label',
            'hide_on_screen'        => '',
            'active'                => true,
            'description'           => __( 'Configure interactive video questions and responses for this concert (add-on feature).', 'festival-bach-understrap' ),
            'show_in_rest'          => 0,
        )
    );
}

add_action( 'acf/init', 'festival_register_interactive_video_acf_fields' );