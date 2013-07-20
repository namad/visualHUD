/* --- Accuracy indicator --- */
menuDef {
	name "Accuracy"
	fullScreen MENU_FALSE
	visible MENU_TRUE
	rect <?= $menuItem->coordinates->left; ?> <?= $menuItem->coordinates->top; ?> <?= $menuItem->coordinates->width; ?> <?= $menuItem->coordinates->height; ?>
		
	itemDef {
		name "accuracyIcon"		
		rect <?= $menuItem->iconCoordinates->left ?> <?= $menuItem->iconCoordinates->top ?> <?= $menuItem->iconSize ?> <?= $menuItem->iconSize ?>
		decoration
		visible 1
		style 1
		backcolor 1 1 1 <?= $menuItem->iconOpacity/100; ?>
		background "ui/assets/medal_accuracy.png"
	}
			
  	itemDef {
		name "accuracyValue"
		rect <?= $menuItem->textCoordinates->left ?> <?= $menuItem->textCoordinates->top + $menuItem->textCoordinates->height ?> <?= $menuItem->textCoordinates->width ?> <?= $menuItem->textCoordinates->height ?>
		decoration
		visible 1
		style 1
		visible MENU_TRUE
		ownerdraw CG_SELECTED_PLYR_ACCURACY
		textstyle <?= $menuItem->textStyle ?>
		forecolor <?= decode_color($menuItem->textColor) ?> <?= $menuItem->textOpacity/100?>
		textscale <?= $menuItem->textSize/100 ?>
	}  
		

}