<?
	$top = 0;
	$left = 0;
	$width = $height = $menuItem->iconSize;
	
	if ($menuItem->iconStyle == 0){
		$width = $height = round($menuItem->iconSize*0.825);
		$top = $left = round($menuItem->iconSize / 2 - $width / 2);
	};
	$flagCommon = 'ui/assets/statusbar/flag_in_base';
	$flag3DRed = 'ui/assets/score/flagr';
	$flag3DBlue = 'ui/assets/score/flagb';
	$flagRed = array(0 => $flagCommon, 1 => $flagCommon, $flag3DRed, $flag3DRed);	
	$flagBlue = array(0 => $flagCommon, 1 => $flagCommon, $flag3DBlue, $flag3DBlue);
?>
/* --- Flag indicator --- */

//red player has blue flag
menuDef {
	name "flagIndicator"
	fullScreen MENU_FALSE
	visible MENU_TRUE
	rect <?= $menuItem->coordinates->left; ?> <?= $menuItem->coordinates->top; ?> <?= $menuItem->coordinates->width; ?> <?= $menuItem->coordinates->height; ?> 
	ownerdrawflag CG_SHOW_IF_PLYR_IS_ON_RED
	
<? if ($menuItem->iconStyle == 0 || $menuItem->iconStyle == 2)  : ?>
	itemDef {
		name "playerRect"
		rect 0 0 <?=$menuItem->iconSize?> <?=$menuItem->iconSize?> 
		visible 1
		style 3
		background "ui/assets/hud/flag"
		ownerdrawflag CG_SHOW_IF_PLAYER_HAS_FLAG
	}
<? endif; ?>

	itemDef {
      	name "flag"
        rect <?=$left?> <?=$top?> <?=$width?> <?=$height?> 
		visible 1
		decoration
		style 1
		ownerdrawflag CG_SHOW_IF_PLAYER_HAS_FLAG  
		backcolor 0.2 0.35 1 0.9
		background "<?= $flagBlue[$menuItem->iconStyle] ?>"
	}
}

//blue player has red flag
menuDef {
	name "flagIndicator"
	fullScreen MENU_FALSE
	visible MENU_TRUE
	rect <?= $menuItem->coordinates->left; ?> <?= $menuItem->coordinates->top; ?> <?= $menuItem->coordinates->width; ?> <?= $menuItem->coordinates->height; ?> 
	ownerdrawflag CG_SHOW_IF_PLYR_IS_ON_BLUE
	
<? if ($menuItem->iconStyle == 0 || $menuItem->iconStyle == 2)  : ?>
	itemDef {
		name "playerRect"
		rect 0 0 <?=$menuItem->iconSize?> <?=$menuItem->iconSize?> 
		visible 1
		style 3
		background "ui/assets/hud/flag"
		ownerdrawflag CG_SHOW_IF_PLAYER_HAS_FLAG
	}
<? endif; ?>

	itemDef {
      	name "flag"
        rect <?=$left?> <?=$top?> <?=$width?> <?=$height?> 
		visible 1
		decoration
		style 1
		ownerdrawflag CG_SHOW_IF_PLAYER_HAS_FLAG  
		backcolor 1 0 0 0.9
		background "<?= $flagRed[$menuItem->iconStyle] ?>"
	}
}