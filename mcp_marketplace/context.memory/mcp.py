class ContextMemoryMCP:
    def __init__(self, window_size=5):
        self.window_size = window_size
        self.memory = []

    def add(self, message):
        self.memory.append(message)
        self.memory = self.memory[-self.window_size:]

    def get_memory(self):
        return self.memory
