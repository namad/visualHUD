/* --- chat area --- */
menuDef {
	name "chat area"
	fullScreen MENU_FALSE
	visible MENU_TRUE
	rect 0 0 32 256

	//chatbgLeft
	itemDef {
		name "chatBgLeft"
		rect 3 345 16 64 
		visible 1
		ownerdrawflag CG_SHOW_IF_CHAT_VISIBLE
		decoration
		backcolor 0 0 0 0.5
		style 1
		background "ui/assets/hud/chatl.tga"
	}
	//chatbgMid
	itemDef {
		name "chatBgLeft"
		rect 19 345 601 64 
		visible 1
		ownerdrawflag CG_SHOW_IF_CHAT_VISIBLE
		decoration
		backcolor 0 0 0 0.5
		style 1
		background "ui/assets/hud/chatm.tga"
	}
	//chatbgRight
	itemDef {
		name "chatBgLeft"
		rect 620 345 16 64 
		visible 1
		ownerdrawflag CG_SHOW_IF_CHAT_VISIBLE
		decoration
		backcolor 0 0 0 0.5
		style 1
		background "ui/assets/hud/chatr.tga"
	}
    itemdef {
	    name chatWindow
	    ownerdraw CG_AREA_NEW_CHAT
   	    rect 5 287 634 120
   	    visible 1
	    decoration
	}
}