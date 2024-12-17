# Dice Server MCP

A Model Context Protocol server for rolling dice. This server provides tools for rolling single or multiple dice with customizable number of sides.

## Installation

```bash
npm install @kota/dice-server
```

## Usage

This MCP server provides two tools:

### 1. roll_dice
Roll a single die with a specified number of sides.

Parameters:
- `sides` (optional): Number of sides on the die (default: 6)

Example:
```typescript
// Roll a standard six-sided die
{
  "name": "roll_dice"
}

// Roll a twenty-sided die
{
  "name": "roll_dice",
  "arguments": {
    "sides": 20
  }
}
```

### 2. roll_multiple_dice
Roll multiple dice with specified number of sides.

Parameters:
- `count` (required): Number of dice to roll (1-100)
- `sides` (optional): Number of sides on each die (default: 6)

Example:
```typescript
// Roll three six-sided dice
{
  "name": "roll_multiple_dice",
  "arguments": {
    "count": 3
  }
}

// Roll four twenty-sided dice
{
  "name": "roll_multiple_dice",
  "arguments": {
    "count": 4,
    "sides": 20
  }
}
```

## License

MIT
