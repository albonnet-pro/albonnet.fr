import { z } from "zod";

export const settingsSchema = z.object({
  brandName:      z.string().min(1).max(60),
  email:          z.string().email().max(120),
  location:       z.string().max(100),
  footerText:     z.string().max(200),
  socialGithub:   z.string().url().max(200).or(z.literal("")),
  socialLinkedin: z.string().url().max(200).or(z.literal("")),
  socialTwitter:  z.string().url().max(200).or(z.literal("")),
});

const statSchema = z.object({
  number:   z.string().min(1).max(20),
  label:    z.string().min(1).max(60),
  position: z.number().int().min(0).optional(),
});

export const heroSchema = z.object({
  badge:       z.string().min(1).max(80),
  title:       z.string().min(1).max(200),
  description: z.string().min(1).max(400),
  stats:       z.array(statSchema).max(6).optional(),
});

const serviceSchema = z.object({
  title:       z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  icon:        z.string().max(30),
});

export const servicesSchema = z.array(serviceSchema).max(12);

const projectSchema = z.object({
  title:       z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  color:       z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  imageUrl:    z.string().max(500).optional(),
  url:         z.string().url().max(500).or(z.literal("")).optional(),
  tags:        z.array(z.string().max(30)).max(10).optional(),
});

export const projectsSchema = z.array(projectSchema).max(20);

const expertiseGroupSchema = z.object({
  label:       z.string().min(1).max(80),
  description: z.string().min(1).max(300),
  items:       z.array(z.string().max(40)).max(20),
});

export const expertiseSchema = z.array(expertiseGroupSchema).max(10);
