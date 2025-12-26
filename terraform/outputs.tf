# -----------------------------------------------------------------------------
# GitHub Actions Configuration
# -----------------------------------------------------------------------------

output "github_actions_role_arn" {
  description = "ARN of the IAM role for GitHub Actions (add as secret: AWS_ROLE_ARN)"
  value       = aws_iam_role.github_actions.arn
}

output "aws_region" {
  description = "AWS region (add as variable: AWS_REGION)"
  value       = var.aws_region
}

output "s3_bucket_name" {
  description = "S3 bucket name (add as variable: S3_BUCKET_NAME)"
  value       = aws_s3_bucket.calendar.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (add as variable: CLOUDFRONT_DISTRIBUTION_ID)"
  value       = aws_cloudfront_distribution.calendar.id
}

# -----------------------------------------------------------------------------
# DNS Configuration
# -----------------------------------------------------------------------------

output "cloudfront_domain_name" {
  description = "CloudFront domain name (point your DNS CNAME here)"
  value       = aws_cloudfront_distribution.calendar.domain_name
}

output "acm_certificate_validation" {
  description = "DNS records needed to validate the ACM certificate"
  value = {
    for dvo in aws_acm_certificate.calendar.domain_validation_options : dvo.domain_name => {
      type  = dvo.resource_record_type
      name  = dvo.resource_record_name
      value = dvo.resource_record_value
    }
  }
}

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------

output "setup_instructions" {
  description = "Next steps after terraform apply"
  value       = <<-EOT

    ╔══════════════════════════════════════════════════════════════════╗
    ║                     NESTE STEG                                   ║
    ╠══════════════════════════════════════════════════════════════════╣
    ║                                                                  ║
    ║  1. DNS-VALIDERING AV SSL-SERTIFIKAT                            ║
    ║     Legg til CNAME-oppføringa frå 'acm_certificate_validation'  ║
    ║     hjå din DNS-leverandør.                                     ║
    ║                                                                  ║
    ║  2. DNS-PEIKING TIL CLOUDFRONT                                  ║
    ║     Legg til CNAME for domenet ditt:                            ║
    ║     ${var.domain_name} -> ${aws_cloudfront_distribution.calendar.domain_name}
    ║                                                                  ║
    ║  3. GITHUB SECRETS OG VARIABLES                                 ║
    ║     Secrets:                                                    ║
    ║       AWS_ROLE_ARN = ${aws_iam_role.github_actions.arn}
    ║                                                                  ║
    ║     Variables:                                                  ║
    ║       AWS_REGION = ${var.aws_region}
    ║       S3_BUCKET_NAME = ${aws_s3_bucket.calendar.id}
    ║       CLOUDFRONT_DISTRIBUTION_ID = ${aws_cloudfront_distribution.calendar.id}
    ║                                                                  ║
    ║  4. FYRSTE UTRULLING                                            ║
    ║     Push til main-greina eller køyr workflow manuelt.           ║
    ║                                                                  ║
    ╚══════════════════════════════════════════════════════════════════╝

  EOT
}
