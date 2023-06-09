USE [Fairly]
GO
/****** Object:  StoredProcedure [dbo].[Users_SelectAll_Paginated]    Script Date: 5/9/2023 6:33:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 --=============================================
 --Author: <Morris, Kolby>
 --Create date: <2023-04-07>
 --Description: <SelectAll_Paginated for Users>
 --Code Reviewer: Jose Chism 

 --MODIFIED BY: Dustin Polk
 --MODIFIED DATE: 04-24-2023
 --Code Reviewer: Jose Chism
 --Note: 
 --=============================================
 
 ALTER PROC [dbo].[Users_SelectAll_Paginated]
		@PageIndex int
		,@PageSize int
AS

/*---------------- TEST CODE -----------------

	DECLARE		@PageIndex int = '0'
			,@PageSize int = '10'

	EXECUTE dbo.Users_SelectAll_Paginated
			@PageIndex
			,@PageSize

*/

BEGIN

	DECLARE @offset int = @PageIndex * @PageSize

	SELECT	u.Id
		,u.FirstName
		,u.LastName
		,u.Mi
		,u.AvatarUrl
		,u.Email
		,u.IsConfirmed
		,u.StatusId
		,st.Name
		,u.DateCreated
		,u.DateModified
		,u.IsProfileViewable
		,TotalCount = COUNT(1) OVER()

	FROM	[dbo].[Users] AS u
		INNER JOIN [dbo].[StatusTypes] AS st
			ON u.StatusId = st.Id

	ORDER BY [Id]

	OFFSET @offset ROWS
	FETCH NEXT @PageSize ROWS ONLY

 END
