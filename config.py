from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    db_url: str

    model_config = {
        "env_file": ".env"
    }

settings = Settings() # type: ignore[call-arg]