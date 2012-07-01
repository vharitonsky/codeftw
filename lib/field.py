import random

class GridCell(object):

    x = None
    y = None
    player = None

    def __init__(self, x, y):
        self.x = x
        self.y = y


class BattleField(object):

    cells = None
    players = None
    cell_size = None

    def __init__(self, height, width, cell_size):
        self.height = height
        self.width = width
        self.cells = {}
        self.players = {}
        self.cell_size = cell_size
        for i in range(0, height, cell_size):
            for j in range(0, width, cell_size):
                self.cells["%s_%s" % (i, j)] = GridCell(i, j)

    def add_player(self, name, x = 0, y = 0):
        x = 0
        y = 0
        while self.cells['%s_%s' % (x, y)].player:
            x = random.randint(0, self.width / self.cell_size - 1) * self.cell_size
            y = random.randint(0, self.height / self.cell_size - 1) * self.cell_size
        self.players[name] = x, y, 'up'
        self.occupy_cell(self.cells['%s_%s' % (x, y)], name)
        return x, y

    def remove_player(self, name):
        try:
            del self.players[name]
        except KeyError:
            pass

    def rotate_player(self, name, direction):
        if name in self.players:
            x, y, old_direction = self.players[name]
            self.players[name] = x, y, direction
            return True
        return False

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
        self.occupy_cell(self.cells["%s_%s" % (new_x, new_y)], name)

        return True

    def calculate_shot(self, shooter):
        cells = {}
        for player in self.players:
            cells['%s_%s' % (self.players[player][0], self.players[player][1])] = player
        x, y, direction = self.players[shooter]
        if direction == 'up':
            increment = lambda x, y:(x, y - self.cell_size)
        if direction == 'down':
            increment = lambda x, y:(x, y + self.cell_size)
        if direction == 'left':
            increment = lambda x, y:(x - self.cell_size, y)
        if direction == 'right':
            increment = lambda x, y:(x + self.cell_size, y)

        while x >= 0 and x < self.width and y >= 0 and y < self.height:
            x, y = increment(x, y)
            player = cells.get('%s_%s' % (x, y))
            if player:
                return player


    def occupy_cell(self, occupied_cell, player):
        for cell in self.cells.values():
            if cell.player == player:
                cell.player = None

        occupied_cell.player = player
        return occupied_cell


    def get_players(self):
        return self.players.items()

