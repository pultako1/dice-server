#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Create an MCP server with dice rolling capabilities
 */
const server = new Server(
  {
    name: "dice-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Roll a single die with the specified number of sides
 */
function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Handler that lists available tools.
 * Exposes dice rolling tools.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "roll_dice",
        description: "Roll a single die with specified number of sides",
        inputSchema: {
          type: "object",
          properties: {
            sides: {
              type: "number",
              description: "Number of sides on the die",
              minimum: 2,
              default: 6
            }
          }
        }
      },
      {
        name: "roll_multiple_dice",
        description: "Roll multiple dice with specified number of sides",
        inputSchema: {
          type: "object",
          properties: {
            count: {
              type: "number",
              description: "Number of dice to roll",
              minimum: 1,
              maximum: 100
            },
            sides: {
              type: "number",
              description: "Number of sides on each die",
              minimum: 2,
              default: 6
            }
          },
          required: ["count"]
        }
      }
    ]
  };
});

/**
 * Handler for dice rolling tools.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "roll_dice": {
      const sides = Number(request.params.arguments?.sides) || 6;
      
      if (sides < 2) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Number of sides must be at least 2"
        );
      }

      const result = rollDie(sides);

      return {
        content: [{
          type: "text",
          text: `🎲 Rolled a d${sides}: ${result}`
        }]
      };
    }

    case "roll_multiple_dice": {
      const count = Number(request.params.arguments?.count);
      const sides = Number(request.params.arguments?.sides) || 6;

      if (!count || count < 1 || count > 100) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Count must be between 1 and 100"
        );
      }

      if (sides < 2) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Number of sides must be at least 2"
        );
      }

      const results = Array.from({ length: count }, () => rollDie(sides));
      const total = results.reduce((sum, val) => sum + val, 0);

      return {
        content: [{
          type: "text",
          text: `🎲 Rolled ${count}d${sides}:\n` +
                `Individual rolls: ${results.join(", ")}\n` +
                `Total: ${total}`
        }]
      };
    }

    default:
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${request.params.name}`
      );
  }
});

/**
 * Start the server using stdio transport.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Dice MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
