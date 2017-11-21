<div id="spinoff-status-wrapper" class="field messages <?php print $status_class ?>">

  <div style="height: 15px"><h3 id="spinoff-status" class="field-label">Status: <span><?php print $status ?></span></h3></div>

  <div class="spinoff-collapsible-container<?php print ($job_complete ? ' spinoff-collapsed' : ''); ?>">
    <h4 class="spinoff-collapsible-handle">Process Log:&nbsp;</h4>
    <div id="spinoff-log" class="spinoff-collapsible-content">
      <?php print $job_log; ?>
    </div>
  </div>

</div>