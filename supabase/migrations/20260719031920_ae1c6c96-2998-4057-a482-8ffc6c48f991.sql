-- Restore SELECT access on puppies. Public gets safe columns only; authenticated can read all columns (admin dashboard uses select *).
GRANT SELECT (id, name, breed, gender, age_weeks, color, price, description, image_url, media, available, created_at, updated_at, size, generation, weight_min_lbs, weight_max_lbs, date_of_birth, vet_checked, vaccines_status, view_count, free_delivery) ON public.puppies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.puppies TO authenticated;
GRANT ALL ON public.puppies TO service_role;