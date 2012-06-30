

class GridCell(object):

    x = None
    y = None

    def __init__(self, x, y):
        self.x = x
        self.y = y

class BattleField(object):

    grid_cells = None
    players = None
    cell_size = None

    def __init__(self, height, width, cell_size):
        self.grid_cells = {}
        self.players = {}
        self.cell_size = cell_size
        for i in range(0, height, cell_size):
            for j in range(0, width, cell_size):
                self.grid_cells["%s_%s" % (i, j)] = GridCell(i, j)

    def add_player(self, name, x = 0, y = 0):
        self.players[name] = x, y, 'up'

    def remove_player(self, name):
        try:
            del self.players[name]
        except KeyError:
            pass

    def move_player(self, name, x, y, direction):
        if not name in self.players:
            start_x, start_y = new_x, new_y = x, y
        else:
            start_x, start_y, old_direction = new_x, new_y, new_direction = self.players[name]

        if direction == 'left':
            new_x = start_x - self.cell_size
        if direction == 'right':
            new_x = start_x + self.cell_size
        if direction == 'up':
            new_y = start_y - self.cell_size
        if direction == 'down':
            new_y = start_y + self.cell_size

        self.players[name] = (new_x, new_y, direction)

        return True

    def get_players(self):
        return self.players.items()

