/* --- CTF Powerup indicator --- */
//useable pickups
menuDef {
	name "CTFPowerupIndicator"
	fullScreen MENU_FALSE
	visible MENU_TRUE
	rect <?= $menuItem->coordinates->left; ?> <?= $menuItem->coordinates->top; ?> <?= $menuItem->coordinates->width; ?> <?= $menuItem->coordinates->height; ?> 
	
	itemDef {
      	name "CTFPOWERUP"
		rect 0 0 <?= $menuItem->iconSize ?> <?= $menuItem->iconSize ?> 
		visible 1
		decoration
		ownerdraw CG_CTF_POWERUP
	}
}