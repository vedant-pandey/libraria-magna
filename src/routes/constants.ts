export const Routes = {
	AdminLogin         : '/admin/login/',
	AdminDashboard     : '/admin/dashboard/',

	UserLogin          : '/users/login/',
	UserRegister       : '/users/register/',
	GetAllUsers        : '/users/all/',
	ViewUserDetail     : '/users/:id/',
	EditUserDetail     : '/users/:id/edit/',

	GetAllBooks        : '/books/all/',
	ViewIssuedBooks    : '/books/issued/',
	CreateBook         : '/books/create/',
	GetBook            : '/books/:id/',
	UpdateBook         : '/books/:id/edit/',
	DeleteBook         : '/books/:id/delete/',
	ChangeAvailability : '/books/:id/makeAvailable/',
	ChangeIssuability  : '/books/:id/makeIssuable/',

	ViewIssueHistory   : '/issuances/history/',
	DeleteIssuance     : '/issuances/:id/delete/',
	IssueForRead       : '/issuances/read/:id/',
	IssueForBorrow     : '/issuances/borrow/:id/',
	AcceptIssueRequest : '/issuances/accept/:id/',
	ViewAllIssuance    : '/issuances/all/',

	Logout             : '/logout/',
	NotFound           : '/notFound/'
}

export const Pages = {
	AdminLogin       : 'admin/login',
	AdminDashboard   : 'admin/dashboard',

	UserLogin        : 'user/login',
	UserRegister     : 'user/register',
	GetUsers         : 'user/list',
	UserDetail       : 'user/detail',
	UserEdit         : 'user/edit',
	ViewIssueHistory : 'user/issue-history', // also contain button for delete

	ViewAllBooks     : 'book/list',
	ViewIssuedBooks  : 'book/issued',
	IssueBook        : 'book/issue',
	CreateBook       : 'book/create',
	UpdateBook       : 'book/edit',
	BookDetail       : 'book/info', // ChangeAvailability, ChangeIssuability, and book detail

	IssueRequests    : 'issuance/list', // approve issuance

	NotFound         : 'notfound',
}