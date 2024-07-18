import logging.config

import yaml


def setup_logging():
    with open("app/logging_config.yaml", "r") as file:
        config = yaml.safe_load(file)
        logging.config.dictConfig(config)

setup_logging()

logger = logging.getLogger("app_logger")