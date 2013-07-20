// <?= $bar_steps ?>

menuDef {
	name "box"
	fullScreen MENU_FALSE
	visible MENU_TRUE
	rect <?= $menuItem->coordinates->left ?> <?= $menuItem->coordinates->top ?> <?= $menuItem->coordinates->width ?> <?= $menuItem->coordinates->height ?>

    ownerdrawflag <?= $menuItem->ownerDrawFlag ?>

	itemDef {
	  name "boxBackground"
		rect 0 0  <?= $menuItem->coordinates->width ?> <?= $menuItem->coordinates->height ?>

		visible 1
		style WINDOW_STYLE_FILLED
		backcolor <?= decode_color($menuItem->color) ?> <?= $menuItem->opacity/100 ?>

	}

<? for($i = 0; $i < $bar_steps; $i++) : ?>
	itemDef {
		name "bar_100_<?= $i ?>"
		visible 1
		rect <?= get_bar_left_offset($menuItem, $i) ?> <?= get_bar_top_offset($menuItem, $i) ?> <?= get_bar_width($menuItem, $i) ?> <?= get_bar_height($menuItem, $i) ?>

		style 1
		background "ui/assets/score/statsfillm"
		forecolor 0 0 0 0
		ownerdraw <?= get_bar_ownerdraw($menuItem) ?>

		addColorRange <?= $i*2 ?> <?= $i*2+1 ?> <?= decode_color(get_range_color($menuItem->colorRanges, $i)) ?> <?= $menuItem->barsOpacity / 100 ?>

	}
<? endfor; ?>

	itemDef {
		name "bar_100"
		visible 1
		rect <?= $offset ?> <?= $top ?> <?= $width ?> <?= $barHeight ?>

		style 1
		background "ui/assets/score/statsfillm"
		forecolor 0 0 0 0
		ownerdraw CG_PLAYER_ARMOR_VALUE
		addColorRange 100 200 <?= decode_color(get_range_color($menuItem->colorRanges, 100, 200)) ?> <?= $menuItem->barsOpacity / 100 ?>

	}

<? for($i = 1; $i <= $bar_steps; $i++) : ?>
	itemDef {
		name "bar_200_<?= $i ?>"
		visible 1
		rect <?= get_bar_left_offset($menuItem, $i) ?> <?= $top ?> <?= round($minWidth * $i) ?> <?= get_bar_height($menuItem, $i) ?>

		style 1
		background "ui/assets/score/statsfillm"
		forecolor 0 0 0 0
		ownerdraw CG_PLAYER_ARMOR_VALUE
		addColorRange <?= 100 + $i*2 ?> <?= 101 + $i*2 ?> <?= decode_color($menuItem->colorRanges[2]->color) ?> <?= $menuItem->barsOpacity / 100 ?>

	}
<? endfor; ?>
}