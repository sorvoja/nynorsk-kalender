variable "aws_region" {
  description = "AWS region for the S3 bucket and other resources"
  type        = string
  default     = "eu-north-1"
}

variable "bucket_name" {
  description = "Name of the S3 bucket for hosting the calendar"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the calendar (e.g., kalender.example.no)"
  type        = string
}

variable "github_org" {
  description = "GitHub username or organization"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "create_oidc_provider" {
  description = "Whether to create the GitHub OIDC provider (set to false if it already exists)"
  type        = bool
  default     = true
}
