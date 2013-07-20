/* --- Armor indicator --- */
<?
	$iconOpacity = $menuItem->iconOpacity/100;
	$armorIconTop = $menuItem->iconCoordinates->top;
	if($menuItem->iconStyle == 1){
		$armorIconTop -= 12;
	};
?>
menuDef {
	name "armorIndicator"
	fullScreen MENU_FALSE
	visible MENU_TRUE
	rect <?= $menuItem->coordinates->left; ?> <?= $menuItem->coordinates->top; ?> <?= $menuItem->coordinates->width; ?> <?= $menuItem->coordinates->height; ?>

    ownerdrawflag <?= $menuItem->ownerDrawFlag ?>

<? if ($menuItem->iconStyle == 0) : ?>
	itemDef {
		name "armorIndicatorIcon" 
		rect <?= $menuItem->iconCoordinates->left ?> <?= $menuItem->iconCoordinates->top ?> <?= $menuItem->iconSize ?> <?= $menuItem->iconSize ?>

		visible 1
		decoration
		style 1
		backcolor 1 1 1 <?= $iconOpacity ?>

		background "ui/assets/hud/armor.tga"
<? if ($menuItem->teamColors) : ?>
		ownerdraw CG_TEAM_COLORIZED 
<? endif; ?>
	}
<? endif; ?>

<? if ($menuItem->iconStyle == 1) : ?>
	itemDef {
		name "armorIndicatorIcon" 
		rect <?= $menuItem->iconCoordinates->left ?> <?= $menuItem->iconCoordinates->top ?> <?= $menuItem->iconSize ?> <?= $menuItem->iconSize ?>

		visible 1
		decoration
		style 1
		cvarTest "cg_draw3dIcons" 
		showCvar {0}
		background "icons/iconr_red"
	}
<? endif; ?>

<? if ($menuItem->iconStyle == 1) : ?>
	itemDef {
		name "armorIndicatorIcon" 
		rect <?= $menuItem->iconCoordinates->left ?> <?= $menuItem->iconCoordinates->top ?> <?= $menuItem->iconSize ?> <?= $menuItem->iconSize ?>

		visible 1
		decoration
		style 1
		cvarTest "cg_draw3dIcons" 
		showCvar {1} 
		ownerdraw CG_PLAYER_ARMOR_ICON 
	}
<? endif; ?>

	itemDef {
		name "armorIndicatorCounter" 
		rect <?= $menuItem->textCoordinates->left ?> <?= $menuItem->textCoordinates->top ?> <?= $menuItem->textCoordinates->width ?> <?= $menuItem->textCoordinates->height ?>

		visible 1
		textalign 0
		decoration
		textstyle <?= $menuItem->textStyle ?>

		forecolor <?= decode_color($menuItem->textColor) ?> <?= $menuItem->textOpacity/100 ?>

		textscale <?= $menuItem->textSize/100 ?>

		ownerdraw CG_PLAYER_ARMOR_VALUE
<? foreach($menuItem->colorRanges as $r) : ?>
		addColorRange <?= $r->range[0] ?> <?= $r->range[1] ?> <?= decode_color($r->color) ?> <?= $menuItem->textOpacity/100?>

<? endforeach; ?>
	}
}