/* --- Timer --- */
<?
//	calc position for timer text
	$iconTop = $menuItem->iconCoordinates->top;
	$textTop = $menuItem->textCoordinates->top + $menuItem->textCoordinates->height;
?>

menuDef {
	name "timer"
	fullScreen MENU_FALSE
	visible MENU_TRUE
	rect <?= $menuItem->coordinates->left ?> <?= $menuItem->coordinates->top ?> <?= $menuItem->coordinates->width ?> <?= $menuItem->coordinates->height ?>

    ownerdrawflag <?= $menuItem->ownerDrawFlag ?>
	
	itemDef {
		name "timerIcon"
		rect <?= $menuItem->iconCoordinates->left ?> <?= $iconTop ?> <?= $menuItem->iconSize ?> <?= $menuItem->iconSize ?> 
		visible 1
		decoration		
		style 1
		backcolor 1 1 1 <?= $menuItem->iconOpacity/100 ?> 
		background "icons/icon_time.tga"
	}

	itemDef {
		name "timerCounter"
		rect <?= $menuItem->textCoordinates->left ?> <?= $textTop ?> <?= $menuItem->textCoordinates->width ?> <?= $menuItem->textCoordinates->height ?> 
		visible 1
		textalign 0
		decoration
		textstyle <?= $menuItem->textStyle ?> 
		forecolor <?= decode_color($menuItem->textColor) ?> <?= $menuItem->textOpacity/100 ?> 
		textscale <?= $menuItem->textSize/100 ?> 
		ownerdraw CG_LEVELTIMER
	}
}