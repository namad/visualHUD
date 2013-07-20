<?
	$array = array('', 'ui/assets/medal_accuracy.tga', 'ui/assets/hud/chatm.tga', 'ui/assets/halfgradright', 'ui/assets/halfgradleft');
	
	$width = $menuItem->coordinates->width;
	$height = $menuItem->coordinates->height;
	$top = 0;
	$left = 0;
	$name = ($menuItem->name == "scoreBox") ? "scoreBox_$menuItem->scoreboxStyle" : $menuItem->name;
	
	$chatHeight = $menuItem->coordinates->height - 2 * $menuItem->padding;
	$chatHeight = ( $chatHeight < 120) ? 120 : $chatHeight;
	$chatWidth = $menuItem->coordinates->width - 2 * $menuItem->padding;
	
	$chatTop = ($chatHeight == 120) ? $menuItem->coordinates->height - $chatHeight - $menuItem->padding : $menuItem->padding;
	$chatTop -= 2;
	$chatLeft = $menuItem->padding;
?>

/* --- rectangle box --- */
menuDef {
	name "chatArea"
	fullScreen MENU_FALSE
	visible MENU_TRUE
	rect <?= $menuItem->coordinates->left ?> <?= $menuItem->coordinates->top ?> <?= $menuItem->coordinates->width ?> <?= $menuItem->coordinates->height ?> 
	
<? if ($menuItem->borderRadius > 0) : ?><? foreach($menuItem->rbox as $box) : ?>
	itemDef {
		name "boxBackground"
		rect <?= $box->left ?> <?= $box->top ?>  <?= $box->width ?> <?= $box->height ?> 
		visible 1
		style WINDOW_STYLE_FILLED
		ownerdrawflag CG_SHOW_IF_CHAT_VISIBLE
		backcolor <?= decode_color($menuItem->color) ?> <?= $box->opacity/100 ?> 
	}
<? endforeach; ?><? endif; ?>

<? if ($menuItem->borderRadius == 0) : ?>
	itemDef {
		name "boxBackground"
		rect <?= $left ?> <?= $top ?>  <?= $width ?> <?= $height ?> 
		visible 1
		style WINDOW_STYLE_FILLED
		ownerdrawflag CG_SHOW_IF_CHAT_VISIBLE
		backcolor <?= decode_color($menuItem->color) ?> <?= $menuItem->opacity/100 ?> 
		<? if($menuItem->boxStyle > 0) : ?>background "<?= $array[$menuItem->boxStyle] ?>"<? endif; ?> 
	}
<? endif; ?>

    itemdef {
		name chatWindow
		ownerdraw CG_AREA_NEW_CHAT
		rect <?= $chatLeft ?> <?= $chatTop ?> <?= $chatWidth ?> <?= $chatHeight ?> 
		visible 1
		decoration
	}
}