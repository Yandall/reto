PGDMP     8    ,                y            Reto    13.2    13.2     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16394    Reto    DATABASE     e   CREATE DATABASE "Reto" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Spanish_Colombia.1252';
    DROP DATABASE "Reto";
                postgres    false            �            1259    16405    users    TABLE     �   CREATE TABLE public.users (
    email text NOT NULL,
    password text NOT NULL,
    type_id text NOT NULL,
    id numeric NOT NULL,
    name text NOT NULL,
    lastname text NOT NULL,
    role text,
    phone numeric NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �          0    16405    users 
   TABLE DATA                 public          postgres    false    200   c       "           2606    16414    users unique_id 
   CONSTRAINT     H   ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_id UNIQUE (id);
 9   ALTER TABLE ONLY public.users DROP CONSTRAINT unique_id;
       public            postgres    false    200            $           2606    16412    users users_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (email);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    200            �     x���Mk�0������PgYvY	=JK�kQ55�;�ؿ���������,�T���{C�S�F��
�m&�֑J�"!��ԶO��e�½	W�Ąp��>��V�&���P�U���u�6��qBbL)�]V<-��-��H����n�a�)KSJ�y���*<�0�(4c!ه�ްb��%��'{�G�7��?�"��W��-QZ�vn�B�^vXlʲ��{���Uy���Y��aRM)8��L}�Ͼ"     