terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Uncomment to use S3 backend for state
  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "calendar/terraform.tfstate"
  #   region = "eu-north-1"
  # }
}

# Primary provider for most resources
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = "norsk-kalender"
      ManagedBy = "terraform"
    }
  }
}

# ACM certificates for CloudFront must be in us-east-1
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project   = "norsk-kalender"
      ManagedBy = "terraform"
    }
  }
}
