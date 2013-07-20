<?
	
	$top = $menuItem->coordinates->height + $menuItem->coordinates->top;
	$textLength = strlen($menuItem->template);
	if($textLength > 0) {
		$text = $menuItem->template.':';
	} else {
		$text = '';
	}
	$scale = 1.0;
?>
/*
	SKILL TRATING INDICATOR
	better code this time, thanks to JOZ
*/
menuDef {
	name "skillRating"
	visible MENU_TRUE
	rect <?= $menuItem->coordinates->left ?> <?= $top ?> <?= $menuItem->coordinates->width ?> <?= $menuItem->coordinates->height ?> 
<? if($menuItem->ownerDraw) : ?>
	ownerdrawflag <?= $menuItem->ownerDraw  ?>
<? endif; ?>

	itemDef {
		visible 1
		rect <?= $menuItem->textCoordinates->left ?> 0 <?= $menuItem->textCoordinates->width ?> <?= $menuItem->textCoordinates->height ?> 
		textstyle <?= $menuItem->textStyle ?> 
		textscale <?= $menuItem->textSize/100 ?> 
		forecolor <?= decode_color($menuItem->textColor) ?> <?= $menuItem->textOpacity/100 ?> 
		text "<?= $text ?>"
	}

	itemDef {
		visible 1
		rect <?= $menuItem->textCoordinates->width / $scale ?> 0 <?= $menuItem->counterCoordinates->width ?> <?= $menuItem->counterCoordinates->height ?> 
		textstyle <?= $menuItem->textStyle ?> 
		textscale <?= $menuItem->textSize/100 ?> 
		forecolor <?= decode_color($menuItem->colorRanges[0]->color) ?> <?= $menuItem->textOpacity/100 ?> 
		cvar "sv_skillrating" 
		cvarTest "sv_skillrating"
		showCvar {<?= get_skill_range($menuItem->colorRanges[0]->range[0], $menuItem->colorRanges[0]->range[1]) ?> }
	}
	itemDef {
		visible 1
		rect <?= $menuItem->textCoordinates->width / $scale ?> 0 <?= $menuItem->counterCoordinates->width ?> <?= $menuItem->counterCoordinates->height ?> 
		textstyle <?= $menuItem->textStyle ?> 
		textscale <?= $menuItem->textSize/100 ?> 
		forecolor <?= decode_color($menuItem->colorRanges[1]->color) ?> <?= $menuItem->textOpacity/100 ?> 
		cvar "sv_skillrating" 
		cvarTest "sv_skillrating"
		showCvar {<?= get_skill_range($menuItem->colorRanges[1]->range[0], $menuItem->colorRanges[1]->range[1]) ?> }
	}
	itemDef {
		visible 1
		rect <?= $menuItem->textCoordinates->width / $scale ?> 0 <?= $menuItem->counterCoordinates->width ?> <?= $menuItem->counterCoordinates->height ?> 
		textstyle <?= $menuItem->textStyle ?> 
		textscale <?= $menuItem->textSize/100 ?> 
		forecolor <?= decode_color($menuItem->colorRanges[2]->color) ?> <?= $menuItem->textOpacity/100 ?> 
		cvar "sv_skillrating" 
		cvarTest "sv_skillrating"
		hideCvar {<?= get_skill_range($menuItem->colorRanges[0]->range[0], $menuItem->colorRanges[0]->range[1]) ?>,<?= get_skill_range($menuItem->colorRanges[1]->range[0], $menuItem->colorRanges[1]->range[1]) ?> }
	}

}