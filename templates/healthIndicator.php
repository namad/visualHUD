/* --- Health indicator --- */
<?
	$iconOpacity = $menuItem->iconOpacity/100;
	
	// how to calc Critical Icon size and position
	$size = $menuItem->iconSize + 6;
	$left = $menuItem->iconCoordinates->left - 3;
	$top = $menuItem->iconCoordinates->top - 3;
?>

menuDef {
	name "healthIndicator"
	fullScreen MENU_FALSE
	visible MENU_TRUE
	rect <?= $menuItem->coordinates->left; ?> <?= $menuItem->coordinates->top; ?> <?= $menuItem->coordinates->width; ?> <?= $menuItem->coordinates->height; ?>

    ownerdrawflag <?= $menuItem->ownerDrawFlag ?>

<? if ($menuItem->iconStyle == 0 && $menuItem->iconSize > 0 && $iconOpacity > 0) : ?>
	itemDef {
		name "healthIndicatorCritical"
		rect <?= $left ?> <?= $top ?> <?= $size ?> <?= $size ?> 
		visible 1
		decoration
		style 3
		ownerdrawflag CG_SHOW_HEALTHCRITICAL
		background "ui/assets/hud/healthalert"
	}
<? endif; ?>
	
	itemDef {
		name "healthIndicatorIcon" 
		rect <?= $menuItem->iconCoordinates->left ?> <?= $menuItem->iconCoordinates->top ?> <?= $menuItem->iconSize ?> <?= $menuItem->iconSize ?> 
		visible 1
		decoration
		style 1
<? if ($menuItem->iconStyle == 0) : ?>
		backcolor 1 1 1 <?= $iconOpacity ?> 
		background "ui/assets/hud/health.tga"
<? endif; ?>
<? if ($menuItem->teamColors && $menuItem->iconStyle == 0) : ?>
		ownerdraw CG_TEAM_COLORIZED 
<? endif; ?>
<? if ($menuItem->iconStyle == 1) : ?>
		ownerdraw CG_PLAYER_HEAD
<? elseif ($menuItem->iconStyle == 2) : ?>
		background "icons/iconh_green"
<? elseif ($menuItem->iconStyle == 3) : ?>
		background "icons/iconh_yellow"
<? elseif ($menuItem->iconStyle == 4) : ?>
		background "icons/iconh_red"
<? endif; ?>
	}
	
	itemDef {
		name "healthIndicatorCounter"
		rect <?= $menuItem->textCoordinates->left ?> <?= $menuItem->textCoordinates->top ?> <?= $menuItem->textCoordinates->width ?> <?= $menuItem->textCoordinates->height ?> 
		visible 1
		textalign 0
		decoration
		textstyle <?= $menuItem->textStyle ?> 
		forecolor <?= decode_color($menuItem->textColor) ?> <?= $menuItem->textOpacity/100 ?> 
		textscale <?= $menuItem->textSize/100 ?> 
		ownerdraw CG_PLAYER_HEALTH
<? foreach($menuItem->colorRanges as $r) : ?>
		addColorRange <?= $r->range[0] ?> <?= $r->range[1] ?> <?= decode_color($r->color) ?> <?= $menuItem->textOpacity/100?> 
<? endforeach; ?>
	}
}