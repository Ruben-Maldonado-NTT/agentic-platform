#!/bin/bash

# 🚀 Crea un nuevo agente clonando agent-template y configurando agent_id, name y role
# Uso: ./init-agent.sh agents/agent-ventas "Agente de Ventas" extractor

AGENT_PATH=$1
AGENT_NAME=$2
AGENT_ROLE=$3

if [ -z "$AGENT_PATH" ] || [ -z "$AGENT_NAME" ] || [ -z "$AGENT_ROLE" ]; then
  echo "❌ Uso: $0 <ruta-del-nuevo-agente> <nombre> <rol>"
  echo "   ej: ./init-agent.sh agents/agent-ventas \"Agente de Ventas\" extractor"
  exit 1
fi

AGENT_ID=$(basename "$AGENT_PATH")
TEMPLATE_PATH="agents/agent-template"

if [ ! -d "$TEMPLATE_PATH" ]; then
  echo "❌ No se encontró la plantilla en $TEMPLATE_PATH"
  exit 1
fi

echo "📁 Clonando plantilla desde $TEMPLATE_PATH a $AGENT_PATH..."
cp -r "$TEMPLATE_PATH/" "$AGENT_PATH"

CONFIG_FILE="$AGENT_PATH/config.yaml"

if [ -f "$CONFIG_FILE" ]; then
  echo "🔧 Actualizando config.yaml con agent_id=$AGENT_ID, name=$AGENT_NAME, role=$AGENT_ROLE"

  sed -i '' "s/^agent_id: .*/agent_id: $AGENT_ID/" "$CONFIG_FILE"
  sed -i '' "s/^name: .*/name: \"$AGENT_NAME\"/" "$CONFIG_FILE"
  sed -i '' "s/^role: .*/role: $AGENT_ROLE/" "$CONFIG_FILE"

  echo "✅ Configuración actualizada"
else
  echo "⚠️ config.yaml no encontrado en $CONFIG_FILE"
fi

echo "✅ Agente creado en: $AGENT_PATH"
