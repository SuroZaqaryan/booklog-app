"""add_image_url_column_to_books_table

Revision ID: 078d623a92bf
Revises: c32193d20a8a
Create Date: 2026-01-10 11:00:35.971876

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '078d623a92bf'
down_revision: Union[str, Sequence[str], None] = 'c32193d20a8a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('books', sa.Column('image_url', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('books', 'image_url')
