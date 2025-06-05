from fastapi import HTTPException,status

wrong_user_access = HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Wrong user type",
        )

user_not_found = HTTPException(status_code=404, detail="User not found")