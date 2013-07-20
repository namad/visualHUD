<?
	$array = array('', 'ui/assets/verticalgradient', 'ui/assets/hud/chatm.tga', 'ui/assets/halfgradright', 'ui/assets/halfgradleft');
	
	$width = $menuItem->coordinates->width;
	$height = $menuItem->coordinates->height;
	$top = 0;
	$left = 0;
	
	if($width == 1 && $menuItem->hairLine){
		$width = 0.5;
	};
	if($height == 1 && $menuItem->hairLine){
		$height = 0.5;
	};	
?>

/* --- rectangle box --- */
menuDef {
	name "box"
	fullScreen MENU_FALSE
	visible MENU_TRUE
	rect <?= $menuItem->coordinates->left ?> <?= $menuItem->coordinates->top ?> <?= $menuItem->coordinates->width ?> <?= $menuItem->coordinates->height ?> 
	
<? if ($menuItem->borderRadius > 0) : ?><? foreach($menuItem->rbox as $box) : ?>
	itemDef {
		name "boxBackground"
		rect <?= $box->left ?> <?= $box->top ?>  <?= $box->width ?> <?= $box->height ?> 
		visible 1
		style WINDOW_STYLE_FILLED
		<? if ($menuItem->teamColors == 1) : ?>ownerdrawflag CG_SHOW_ANYNONTEAMGAME<? endif; ?> 
		backcolor <?= decode_color($menuItem->color) ?> <?= $box->opacity/100 ?> 
	}

<? if ($menuItem->teamColors == 1) : ?>
	itemDef {
		name "boxBackground"
		rect <?= $box->left ?> <?= $box->top ?>  <?= $box->width ?> <?= $box->height ?> 
		visible 1
		style WINDOW_STYLE_FILLED
		ownerdrawflag CG_SHOW_IF_PLYR_IS_ON_RED
		backcolor 0.4 0 0 <?= $box->opacity/100 ?> 
	}
	itemDef {
		name "boxBackground"
		rect <?= $box->left ?> <?= $box->top ?>  <?= $box->width ?> <?= $box->height ?> 
		visible 1
		style WINDOW_STYLE_FILLED
		ownerdrawflag CG_SHOW_IF_PLYR_IS_ON_BLUE
		backcolor 0 0 0.4 <?= $box->opacity/100 ?> 
	}		
<? endif; ?>

<? endforeach; ?><? endif; ?>

<? if ($menuItem->borderRadius == 0) : ?>
	itemDef {
		name "boxBackground"
		rect <?= $left ?> <?= $top ?>  <?= $width ?> <?= $height ?> 
		visible 1
		style WINDOW_STYLE_FILLED
		<? if ($menuItem->teamColors == 1) : ?>ownerdrawflag CG_SHOW_ANYNONTEAMGAME<? endif; ?> 
		backcolor <?= decode_color($menuItem->color) ?> <?= $menuItem->opacity/100 ?> 
		<? if($menuItem->boxStyle > 0) : ?>background "<?= $array[$menuItem->boxStyle] ?>"<? endif; ?> 
	}
	
<? if ($menuItem->teamColors == 1) : ?>
	itemDef {
		name "boxBackground"
		rect <?= $left ?> <?= $top ?>  <?= $width ?> <?= $height ?> 
		visible 1
		style WINDOW_STYLE_FILLED
		ownerdrawflag CG_SHOW_IF_PLYR_IS_ON_RED
		backcolor 0.4 0 0 <?= $menuItem->opacity/100 ?> 
		<? if($menuItem->boxStyle > 0) : ?>background "<?= $array[$menuItem->boxStyle] ?>"<? endif; ?> 
	}
	
	itemDef {
		name "boxBackground"
		rect <?= $left ?> <?= $top ?>  <?= $width ?> <?= $height ?> 
		visible 1
		style WINDOW_STYLE_FILLED
		ownerdrawflag CG_SHOW_IF_PLYR_IS_ON_BLUE
		backcolor 0 0 0.4 <?= $menuItem->opacity/100 ?> 
		<? if($menuItem->boxStyle > 0) : ?>background "<?= $array[$menuItem->boxStyle] ?>"<? endif; ?> 
	}		
<? endif; ?>
<? endif; ?>
}