<?

	$position = $menuItem->iconPosition;
	$align = "HUD_HORIZONTAL";
	$offset = $menuItem->textCoordinates->width + $menuItem->iconSpacing;
	
	if($position == 'right'){
		$offset = -1 * ($menuItem->iconSize + $menuItem->coordinates->width + $menuItem->iconSpacing);
	} else if($position == 'top'){
		$align = "HUD_VERTICAL";
		$offset = $menuItem->iconSpacing;
	} else if($position == 'bottom'){
		$align = "HUD_VERTICAL";
		$offset = -1 * (2*$menuItem->iconSize + $menuItem->iconSpacing);
	};
?>
/* --- powerup indicator --- */
menuDef {
	name "powerupIndicator"
	fullScreen MENU_FALSE
	visible MENU_TRUE
	rect <?= $menuItem->coordinates->left ?> <?= $menuItem->coordinates->top ?> <?= $menuItem->coordinates->width ?> <?= $menuItem->coordinates->height ?> 
	
	itemDef {
		name "powerupIndicatorArea"
		rect <?= $menuItem->iconCoordinates->left ?> <?= $menuItem->iconCoordinates->top ?> <?= $menuItem->iconSize ?> <?= $menuItem->iconSize ?> 
		visible 1
		decoration
		textscale <?= $menuItem->textSize / 100 ?> 
		forecolor <?= decode_color($menuItem->textColor) ?> <?= $menuItem->textOpacity/100 ?> 
		textstyle 3
		ownerdraw CG_AREA_POWERUP
		special <?= $offset  ?> 
		align <?= $align ?> 
	}
}