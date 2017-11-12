<?php

/**
 * Implements hook_rules_event_info().
 */
function spinoff_rules_event_info() {
  $events = array(
    'spinoff_jobcomplete' => array(
      'label' => t('After a spinoff process completes'),
      'group' => t('Spinoff'),
      'variables' => array(
        'node' => array(
          'type' => 'node',
          'label' => t('Process node'),
        ),
        'return_code' => array(
          'type' => 'integer',
          'label' => t('Process return code'),
        ),
      ),
    ),
  );
  return $events;
}