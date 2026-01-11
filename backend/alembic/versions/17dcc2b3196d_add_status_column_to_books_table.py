"""add_status_column_to_books_table

Revision ID: 17dcc2b3196d
Revises: 078d623a92bf
Create Date: 2026-01-10 16:59:57.570550

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '17dcc2b3196d'
down_revision: Union[str, Sequence[str], None] = '078d623a92bf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('books', sa.Column('status', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('books', 'status')
