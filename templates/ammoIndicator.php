/* --- Ammo indicator --- */
menuDef {
	name "ammoIndicator"
	fullScreen MENU_FALSE
	visible MENU_TRUE
	rect <?= $menuItem->coordinates->left; ?> <?= $menuItem->coordinates->top; ?> <?= $menuItem->coordinates->width; ?> <?= $menuItem->coordinates->height; ?> // area
	ownerdrawflag <?= $menuItem->ownerDrawFlag ?>

	itemDef {
		name "ammoIndicatorIcon" 
		rect <?= $menuItem->iconCoordinates->left ?> <?= $menuItem->iconCoordinates->top ?> <?= $menuItem->iconSize ?> <?= $menuItem->iconSize ?>

		visible 1
		decoration
		ownerdraw CG_PLAYER_AMMO_ICON
	}

	itemDef {
		name "ammoIndicatorCounter"
		rect <?= $menuItem->textCoordinates->left ?> <?= $menuItem->textCoordinates->top ?> <?= $menuItem->textCoordinates->width ?> <?= $menuItem->textCoordinates->height ?>

		visible 1
		textalign 0
		decoration
		textstyle <?= $menuItem->textStyle ?>

		forecolor <?= decode_color($menuItem->textColor) ?> <?= $menuItem->textOpacity/100?>

		textscale <?= $menuItem->textSize/100 ?>

		ownerdraw CG_PLAYER_AMMO_VALUE

<? foreach($menuItem->colorRanges as $r) : ?>
		addColorRange <?= $r->range[0] ?> <?= $r->range[1] ?> <?= decode_color($r->color) ?> <?= $menuItem->textOpacity/100?>

<? endforeach; ?>

	}
}