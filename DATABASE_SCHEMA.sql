-- ============================================
-- Brand Brief Database Schema
-- ============================================

-- טבלת Projects (פרויקטים)
create table projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  
  -- פרטי הפרויקט
  name text not null default 'Untitled Project',
  status text not null default 'in_progress', -- 'in_progress' | 'completed'
  
  -- לוגו (אחד בלבד!)
  logo_url text,
  logo_prompt text,
  logo_created_at timestamp with time zone,
  
  -- timestamps
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- טבלת Sections (נושאים)
create table sections (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  
  -- פרטי הנושא
  section_key text not null, -- 'base-questions', 'second-questions', etc.
  title text not null,
  
  -- השאלות (JSONB - מערך של QuestionType)
  questions jsonb not null default '[]'::jsonb,
  
  -- מטא-דאטה
  completed_at timestamp with time zone,
  ai_generation_rounds integer default 0,
  
  -- timestamps
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- Unique constraint: כל section_key יכול להופיע רק פעם אחת בפרויקט
  unique(project_id, section_key)
);

-- ============================================
-- Indexes לביצועים
-- ============================================

create index projects_user_id_idx on projects(user_id);
create index projects_status_idx on projects(status);
create index projects_created_at_idx on projects(created_at desc);

create index sections_project_id_idx on sections(project_id);
create index sections_section_key_idx on sections(section_key);

-- ============================================
-- Row Level Security (אבטחה)
-- ============================================

alter table projects enable row level security;
alter table sections enable row level security;

-- Policies for projects
create policy "Users can view own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can create projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on projects for delete
  using (auth.uid() = user_id);

-- Policies for sections
create policy "Users can view own sections"
  on sections for select
  using (
    exists (
      select 1 from projects
      where projects.id = sections.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can create sections"
  on sections for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = sections.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can update own sections"
  on sections for update
  using (
    exists (
      select 1 from projects
      where projects.id = sections.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can delete own sections"
  on sections for delete
  using (
    exists (
      select 1 from projects
      where projects.id = sections.project_id
      and projects.user_id = auth.uid()
    )
  );

-- ============================================
-- Functions & Triggers
-- ============================================

-- Function to update updated_at automatically
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers
create trigger update_projects_updated_at
  before update on projects
  for each row
  execute function update_updated_at_column();

create trigger update_sections_updated_at
  before update on sections
  for each row
  execute function update_updated_at_column();
