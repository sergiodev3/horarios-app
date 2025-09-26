-- Migración para actualizar la tabla schedules
-- Cambiar el campo hour de INTEGER a VARCHAR(10)

-- Primero, crear una columna temporal
ALTER TABLE schedules ADD COLUMN hour_temp VARCHAR(10);

-- Si hay datos existentes, podrías migrarlos (ejemplo comentado)
-- UPDATE schedules SET hour_temp = LPAD(hour::text, 2, '0') || ':00' WHERE hour IS NOT NULL;

-- Eliminar la columna original
ALTER TABLE schedules DROP COLUMN hour;

-- Renombrar la columna temporal
ALTER TABLE schedules RENAME COLUMN hour_temp TO hour;

-- Agregar restricción NOT NULL si es necesario
-- ALTER TABLE schedules ALTER COLUMN hour SET NOT NULL;

-- Verificar la estructura actualizada
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'schedules' AND table_schema = 'public';