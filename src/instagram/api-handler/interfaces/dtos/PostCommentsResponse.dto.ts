export interface IPostCommentsResponse {
	moreAvailable?: boolean
	nextMinId?: { server_cursor: string, is_server_cursor_inverse: boolean}
	data: IPostComment[]
}

export interface IPostComment {
	pk: string
	user_id: number
	text: string
	type: number
	created_at: number
	created_at_utc: number
	content_type: string
	status: string
	bit_flags: number
	did_report_as_spam: boolean
	share_enabled: boolean
	user: User
	is_covered: boolean
	has_liked_comment: boolean
	comment_like_count: number
	child_comment_count: number
	preview_child_comments: IPostComment[]
	parent_comment_id?: string
	other_preview_users: []
	inline_composer_display_condition: string
	private_reply_status: number
	comment_index: number
}

export interface IPreviewChildComment {
	content_type: string
	user: User
	pk: string
	text: string
	type: number
	created_at: number
	created_at_utc: number
	media_id: string
	status: string
	parent_comment_id: string
	share_enabled: boolean
	private_reply_status: number
	has_liked_comment: boolean
	comment_like_count: number
}

export interface User {
	pk: number
	username: string
	full_name: string
	is_private: boolean
	profile_pic_url: string
	profile_pic_id: string
	is_verified: boolean
	follow_friction_type: number
	is_mentionable: boolean
	latest_reel_media: number
	latest_besties_reel_media: number
	has_anonymous_profile_picture?: boolean
	has_highlight_reels?: boolean
	silent_tag_mention_dialog?: boolean
	account_badges?: any[]
}