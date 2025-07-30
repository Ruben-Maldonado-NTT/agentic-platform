#!/bin/bash

echo "🔧 Instalando Angular Material y dependencias..."
npm install @angular/material @angular/cdk @angular/animations --save

echo "✅ Angular Material instalado."

echo "✨ Ejecutando configuración de tema..."
ng add @angular/material --skip-confirmation --theme=indigo-pink --typography=true --animations=true

echo "✅ Configuración de Angular Material completada."
