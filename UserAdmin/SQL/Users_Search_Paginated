USE [Fairly]
GO
/****** Object:  StoredProcedure [dbo].[Users_Search_Paginated]    Script Date: 5/9/2023 6:27:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


 --=============================================
 --Author: Dustin Polk
 --Create date: 04-24-2023
 --Description: Search_Paginated for Users
 --Code Reviewer: Jose Chism

 --MODIFIED BY: 
 --MODIFIED DATE: 
 --Code Reviewer:
 --Note: 
 --=============================================
 
 ALTER PROC [dbo].[Users_Search_Paginated]
	@Query nvarchar(50)
	,@PageIndex int
	,@PageSize int
AS

/*---------------- TEST CODE -----------------

	DECLARE	@Query nvarchar(50) = 'Kolby'
		,@PageIndex int = '0'
		,@PageSize int = '10'

	EXECUTE dbo.Users_Search_Paginated
		@Query
		,@PageIndex
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

	WHERE	u.FirstName LIKE '%' + @Query + '%'
		OR u.LastName LIKE '%' + @Query + '%'

	ORDER BY [Id]

	OFFSET @offset ROWS
	FETCH NEXT @PageSize ROWS ONLY

 END
