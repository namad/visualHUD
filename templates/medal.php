<?
	$icons = array(
	    'ui/assets/medal_accuracy.tga', 'ui/assets/medal_gauntlet.tga', 'ui/assets/medal_excellent.tgs', 'ui/assets/medal_impressive',
	    'ui/assets/medal_capture.tga', 'ui/assets/medal_assist.tga', 'ui/assets/medal_defend.tgs'
	);
	$ownerdraw = array(
	    'CG_ACCURACY', 'CG_GAUNTLET', 'CG_EXCELLENT', 'CG_IMPRESSIVE',
	    'CG_CAPTURES', 'CG_ASSISTS', 'CG_DEFEND'
	);

	// CG_SELECTED_PLYR_ACCURACY
?>
/* --- Medal indicator --- */
menuDef {
	name "Accuracy"
	fullScreen MENU_FALSE
	visible MENU_TRUE
	rect <?= $menuItem->coordinates->left; ?> <?= $menuItem->coordinates->top; ?> <?= $menuItem->coordinates->width; ?> <?= $menuItem->coordinates->height; ?>

	ownerdrawflag <?= $menuItem->ownerDrawFlag ?>
		
	itemDef {
		name "medalIcon"
		rect <?= $menuItem->iconCoordinates->left ?> <?= $menuItem->iconCoordinates->top ?> <?= $menuItem->iconSize ?> <?= $menuItem->iconSize ?>
		decoration
		visible 1
		style 1
		backcolor 1 1 1 <?= $menuItem->iconOpacity/100; ?>

		background "<?= $icons[$menuItem->iconStyle]; ?>"
	}
			
  	itemDef {
		name "medalValue"
		rect <?= $menuItem->textCoordinates->left - 4 ?> <?= $menuItem->textCoordinates->top + $menuItem->textCoordinates->height - 1 ?> 0 <?= $menuItem->textCoordinates->height ?>

		decoration
		visible 1
		style 1
		visible MENU_TRUE
		textstyle <?= $menuItem->textStyle ?>

		forecolor <?= decode_color($menuItem->textColor) ?> <?= $menuItem->textOpacity/100 ?>

		textscale <?= $menuItem->textSize/100 ?>

	}  
}