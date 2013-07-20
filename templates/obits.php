/* --- graphical obits	 --- */
menuDef {
	name "obits"
	fullScreen MENU_FALSE
	visible MENU_TRUE
	rect <?= $menuItem->coordinates->left; ?> <?= $menuItem->coordinates->top; ?> <?= $menuItem->coordinates->width; ?> <?= $menuItem->coordinates->height; ?> 

	itemDef {
		name "obituaries"
		rect 0 12 65 12
		visible 1
		textscale .22
		ownerdraw CG_PLAYER_OBIT	
	}
}

