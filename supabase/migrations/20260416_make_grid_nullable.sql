-- Allow grid_x and grid_y to be null so deleted rooms can release their grid space
ALTER TABLE public.rooms ALTER COLUMN grid_x DROP NOT NULL;
ALTER TABLE public.rooms ALTER COLUMN grid_y DROP NOT NULL;
