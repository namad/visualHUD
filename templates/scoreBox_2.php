/*  
	COMPACT SCORE BOX 
	better scorebox code by JOZ
	thanks, mate ;)
*/

<?
//	calc position for tailing scores
	$boxWidth = 50;
	$boxHeight = 16;
	
	$baseTop = $menuItem->coordinates->top;
	$baseLeft = $menuItem->coordinates->left;
	
	$tailTop = $menuItem->coordinates->top;
	$tailLeft = $menuItem->coordinates->left;

	if ($menuItem->scoreboxLayout == "horizontal"){
		$tailLeft = $baseLeft + $boxWidth + $menuItem->iconSpacing;
	} else if($menuItem->scoreboxLayout == "vertical"){
		$tailTop = $baseTop + $boxHeight + $menuItem->iconSpacing;
	};
?>

#define	SCORES_1ST_POS	<?= $baseLeft ?> <?= $baseTop ?> 
#define	SCORES_2ND_POS	<?= $tailLeft ?> <?= $tailTop ?> 

//top
menuDef {
	name "TopScoresBG"
	fullScreen MENU_FALSE
	visible MENU_TRUE	
	rect SCORES_1ST_POS 50 16
	itemDef {
		name "SelfTLeft"
		rect 0 0 16 16 
		visible 1
		ownerdraw CG_TEAM_COLORIZED
		ownerdrawflag CG_SHOW_IF_PLYR_IS_FIRST_PLACE
		decoration
		style 1
		background "ui/assets/hud/teamonl.tga"
	}
	itemDef {
		name "SelfTMid"
		rect 16 0 18 16 
		visible 1
		ownerdraw CG_TEAM_COLORIZED
		ownerdrawflag CG_SHOW_IF_PLYR_IS_FIRST_PLACE
		decoration
		style 1
		background "ui/assets/hud/teamonm.tga"
	}
	itemDef {
		name "SelfTRight"
		rect 34 0 16 16 
		visible 1
		ownerdraw CG_TEAM_COLORIZED
		ownerdrawflag CG_SHOW_IF_PLYR_IS_FIRST_PLACE
		decoration
		style 1
		background "ui/assets/hud/teamonr.tga"
	}


	itemDef {
		name "TLeft"
		rect 0 0 16 16 
		visible 1
		backcolor 1 1 1 0.25
		ownerdrawflag CG_SHOW_IF_PLYR_IS_NOT_FIRST_PLACE
		decoration
		style 1
		background "ui/assets/hud/teamonl.tga"
	}
	itemDef {
		name "TMid"
		rect 16 0 18 16 
		visible 1
		backcolor 1 1 1 0.25
		ownerdrawflag CG_SHOW_IF_PLYR_IS_NOT_FIRST_PLACE
		decoration
		style 1
		background "ui/assets/hud/teamonm.tga"
	}
	itemDef {
		name "TRight"
		rect 34 0 16 16 
		visible 1
		backcolor 1 1 1 0.25
		ownerdrawflag CG_SHOW_IF_PLYR_IS_NOT_FIRST_PLACE
		decoration
		style 1
		background "ui/assets/hud/teamonr.tga"
	}
}

//bottom
menuDef {
	name "BottomScoresBG"
	fullScreen MENU_FALSE
	visible MENU_TRUE	
	rect SCORES_2ND_POS 50 16
	itemDef {
		name "SelfTLeft"
		rect 0 0 16 16 
		visible 1
		ownerdraw CG_TEAM_COLORIZED
		ownerdrawflag CG_SHOW_IF_PLYR_IS_NOT_FIRST_PLACE
		decoration
		style 1
		background "ui/assets/hud/teamonl.tga"
	}
	itemDef {
		name "SelfTMid"
		rect 16 0 18 16 
		visible 1
		ownerdraw CG_TEAM_COLORIZED
		ownerdrawflag CG_SHOW_IF_PLYR_IS_NOT_FIRST_PLACE
		decoration
		style 1
		background "ui/assets/hud/teamonm.tga"
	}
	itemDef {
		name "SelfTRight"
		rect 34 0 16 16 
		visible 1
		ownerdraw CG_TEAM_COLORIZED
		ownerdrawflag CG_SHOW_IF_PLYR_IS_NOT_FIRST_PLACE
		decoration
		style 1
		background "ui/assets/hud/teamonr.tga"
	}


	itemDef {
		name "TLeft"
		rect 0 0 16 16 
		visible 1
		backcolor 1 1 1 0.25
		ownerdrawflag CG_SHOW_IF_PLYR_IS_FIRST_PLACE
		decoration
		style 1
		background "ui/assets/hud/teamonl.tga"
	}
	itemDef {
		name "TMid"
		rect 16 0 18 16 
		visible 1
		backcolor 1 1 1 0.25
		ownerdrawflag CG_SHOW_IF_PLYR_IS_FIRST_PLACE
		decoration
		style 1
		background "ui/assets/hud/teamonm.tga"
	}
	itemDef {
		name "TRight"
		rect 34 0 16 16 
		visible 1
		backcolor 1 1 1 0.25
		ownerdrawflag CG_SHOW_IF_PLYR_IS_FIRST_PLACE
		decoration
		style 1
		background "ui/assets/hud/teamonr.tga"
	}
}

// RED TEAM SCORE BAR TOP
menuDef {
	name "redTeamScores"
	fullScreen MENU_FALSE
	visible MENU_TRUE	
	rect SCORES_1ST_POS 50 16
	ownerdrawflag CG_SHOW_IF_RED_IS_FIRST_PLACE

// red team score
	itemdef {
		name "blueTeamScore"		
		ownerdraw CG_1STPLACE
		rect 28 12 35 9
		visible 1
		forecolor 1 1 1 0.8
		textscale .24
		textalign 2
		textstyle 2
		decoration
		ownerdrawflag CG_SHOW_ANYTEAMGAME
	}

//TDM marker
	itemDef {
		name "clanArena"
		rect -4 -4 23 23
		visible 1
		backcolor 1 1 1 1
		decoration	
		style 1
		cvartest g_gametype
		showcvar { "3" }
		background "ui/assets/score/ca_arrow_red.tga"
	}
	
//	clan arena count
	itemDef {
		name "clanArena"
		rect 2 2 21 11
		visible 1
		backcolor 1 1 1 1
		decoration	
		style 1
		cvartest g_gametype
		showcvar { "4" ; "9" }
		background "ui/assets/score/ca_score_red.tga"
	}
	itemdef {
		name "redClanPlayers"
		cvartest g_gametype
		showcvar { "4" ; "9" }
		ownerdraw CG_RED_CLAN_PLYRS  
		rect 14 11 136 40
		visible 1
		textscale .18
		forecolor 1 1 1 0.65
		decoration
	}

//	ctf icons	
	itemDef {
		name "f"
		rect 2 2 11 11
		visible 1
		bordercolor 1 1 1 1
		decoration	
		style 3
		ownerdrawflag CG_SHOW_HARVESTER                 
		background "icons/skull_red.tga"
	}
	itemDef {
		name "redflag"
		rect 2 2 11 11
		visible 1
		decoration
		ownerdrawflag CG_SHOW_CTF                       
		ownerdraw CG_RED_FLAGSTATUS
	}
	itemDef {
		name "oneflagstatus"
		rect 2 2 11 11
		visible 1
		decoration                	
		ownerdraw CG_ONEFLAG_STATUS 
	}
}

// RED TEAM SCORE BAR BOTTOM
menuDef {
	name "redTeamScores"
	fullScreen MENU_FALSE
	visible MENU_TRUE	
	rect SCORES_2ND_POS 50 16
	ownerdrawflag CG_SHOW_IF_BLUE_IS_FIRST_PLACE

// red team score
	itemdef {
		name "blueTeamScore"		
		ownerdraw CG_1STPLACE
		rect 28 12 35 9
		visible 1
		forecolor 1 1 1 0.8
		textscale .24
		textalign 2
		textstyle 2
		decoration
		ownerdrawflag CG_SHOW_ANYTEAMGAME
	}

//TDM marker
	itemDef {
		name "clanArena"
		rect -4 -4 23 23
		visible 1
		backcolor 1 1 1 1
		decoration	
		style 1
		cvartest g_gametype
		showcvar { "3" }
		background "ui/assets/score/ca_arrow_red.tga"
	}
	
//	clan arena count
	itemDef {
		name "clanArena"
		rect 2 2 21 11
		visible 1
		backcolor 1 1 1 1
		decoration	
		style 1
		cvartest g_gametype
		showcvar { "4" ; "9" }
		background "ui/assets/score/ca_score_red.tga"
	}
	itemdef {
		name "redClanPlayers"
		cvartest g_gametype
		showcvar { "4" ; "9" }
		ownerdraw CG_RED_CLAN_PLYRS  
		rect 14 11 136 40
		visible 1
		textscale .18
		forecolor 1 1 1 0.65
		decoration
	}

//	ctf icons	
	itemDef {
		name "f"
		rect 2 2 11 11
		visible 1
		bordercolor 1 1 1 1
		decoration	
		style 3
		ownerdrawflag CG_SHOW_HARVESTER                 
		background "icons/skull_red.tga"
	}
	itemDef {
		name "redflag"
		rect 2 2 11 11
		visible 1
		decoration
		ownerdrawflag CG_SHOW_CTF                       
		ownerdraw CG_RED_FLAGSTATUS
	}
	itemDef {
		name "oneflagstatus"
		rect 2 2 11 11
		visible 1
		decoration                	
		ownerdraw CG_ONEFLAG_STATUS 
	}
}

// BLUE TEAM SCORE BAR TOP
menuDef {
	name "blueTeamScores"
	fullScreen MENU_FALSE
	visible MENU_TRUE	
	rect SCORES_1ST_POS 50 16
	ownerdrawflag CG_SHOW_IF_BLUE_IS_FIRST_PLACE

// blue team score
	itemdef {
		name "blueTeamScore"		
		ownerdraw CG_2NDPLACE
		rect 28 12 35 9
		visible 1
		forecolor 1 1 1 0.8
		textscale .24
		textalign 2
		textstyle 2
		decoration
		ownerdrawflag CG_SHOW_ANYTEAMGAME
	}

//TDM marker
	itemDef {
		name "clanArena"
		rect -4 -4 23 23
		visible 1
		backcolor 1 1 1 1
		decoration	
		style 1
		cvartest g_gametype
		showcvar { "3" }
		background "ui/assets/score/ca_arrow_blue.tga"
	}	
//clan arena count
	itemDef {
		name "clanArena"
		rect 2 2 21 11
		visible 1
		backcolor 1 1 1 1
		decoration	
		style 1
		cvartest g_gametype
		showcvar { "4" ; "9" }
		background "ui/assets/score/ca_score_blu.tga"
	}
	itemdef {
		name "blueClanPlayers"
		cvartest g_gametype
		showcvar { "4" ; "9" }
		ownerdraw CG_BLUE_CLAN_PLYRS  
		rect 14 11 136 40
		visible 1
		textscale .18
		forecolor 1 1 1 0.65
		decoration
	}

//	ctf icons
	itemDef {
		name "f"
		rect 2 2 11 11
		visible 1
		bordercolor 1 1 1 .75
		decoration	
		style 3
		ownerdrawflag CG_SHOW_HARVESTER                 
		background "icons/skull_blue.tga"
	}
	itemDef {
		name "blueflag"
		rect 2 2 11 11
		visible 1
		decoration    
		ownerdrawflag CG_SHOW_CTF                    	
		ownerdraw CG_BLUE_FLAGSTATUS
	}
	itemDef {
		name "oneflagstatus"
		rect 2 2 11 11
		visible 1
		decoration                	
		ownerdraw CG_ONEFLAG_STATUS 
	}

}

// BLUE TEAM SCORE BAR BOTTOM
menuDef {
	name "blueTeamScores"
	fullScreen MENU_FALSE
	visible MENU_TRUE	
	rect SCORES_2ND_POS 50 16
	ownerdrawflag CG_SHOW_IF_RED_IS_FIRST_PLACE

// blue team score
	itemdef {
		name "blueTeamScore"		
		ownerdraw CG_2NDPLACE
		rect 28 12 35 9
		visible 1
		forecolor 1 1 1 0.8
		textscale .24
		textalign 2
		textstyle 2
		decoration
		ownerdrawflag CG_SHOW_ANYTEAMGAME

	}

//TDM marker
	itemDef {
		name "clanArena"
		rect -4 -4 23 23
		visible 1
		backcolor 1 1 1 1
		decoration	
		style 1
		cvartest g_gametype
		showcvar { "3" }
		background "ui/assets/score/ca_arrow_blue.tga"
	}	
//clan arena count
	itemDef {
		name "clanArena"
		rect 2 2 21 11
		visible 1
		backcolor 1 1 1 1
		decoration	
		style 1
		cvartest g_gametype
		showcvar { "4" ; "9" }
		background "ui/assets/score/ca_score_blu.tga"
	}
	itemdef {
		name "blueClanPlayers"
		cvartest g_gametype
		showcvar { "4" ; "9" }
		ownerdraw CG_BLUE_CLAN_PLYRS  
		rect 14 11 136 40
		visible 1
		textscale .18
		forecolor 1 1 1 0.65
		decoration
	}

//	ctf icons
	itemDef {
		name "f"
		rect 2 2 11 11
		visible 1
		bordercolor 1 1 1 .75
		decoration	
		style 3
		ownerdrawflag CG_SHOW_HARVESTER                 
		background "icons/skull_blue.tga"
	}
	itemDef {
		name "blueflag"
		rect 2 2 11 11
		visible 1
		decoration    
		ownerdrawflag CG_SHOW_CTF                    	
		ownerdraw CG_BLUE_FLAGSTATUS
	}
	itemDef {
		name "oneflagstatus"
		rect 2 2 11 11
		visible 1
		decoration                	
		ownerdraw CG_ONEFLAG_STATUS 
	}

}


//  SCORE - FIRST PLACE 
menuDef {
	name "1STPlace"
	fullScreen MENU_FALSE
	visible MENU_TRUE	
	rect SCORES_1ST_POS 50 16
	ownerdrawflag CG_SHOW_ANYNONTEAMGAME

	itemDef {
		name "1st place"
		visible 1
		rect -1597 13 1640 40
		textscale .26
		ownerdraw CG_1ST_PLACE_SCORE
		decoration
	}	
}

//  SCORE - SECOND PLACE 
menuDef {
	name "Trailing"
	fullScreen MENU_FALSE
	visible MENU_TRUE	
	rect SCORES_2ND_POS 50 16
	ownerdrawflag CG_SHOW_ANYNONTEAMGAME

	itemDef {
		name "2nd place"
		visible 1
		rect -6597 13 6640 40
		textscale .26
		ownerdraw CG_2ND_PLACE_SCORE
		decoration
	}	
}