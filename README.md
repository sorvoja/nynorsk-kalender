# Norsk Kalender

Ein nettbasert kalender med norsk språkdrakt og høgtidsdagar.

**[Sjå kalenderen på kalender.wn.no](https://kalender.wn.no)**

## Funksjonar

- Syner alle tolv månadene i eit år i eit rutenett (3×4)
- Veketal etter ISO 8601-standarden
- Norske vekedagsforkortingar (M, T, O, T, F, L, S)
- Sundagar og offentlege høgtidsdagar er merkte med raud farge
- Navigering mellom år med piltastar
- Dynamisk utrekning av rørlege høgtidsdagar (påske, pinse, o.a.)
- Forklaringar av høgtidsdagane i tradisjonell nynorsk (fyre 2012-reforma)

## Høgtidsdagar

Kalenderen inneheld alle offentlege høgtidsdagar i Noreg:

### Faste høgtidsdagar
- Nyttårsdag (1. januar)
- Arbeidaranes dag (1. mai)
- Grunnlovsdagen (17. mai)
- Fyrste juledag (25. desember)
- Andre juledag (26. desember)

### Rørlege høgtidsdagar
- Skjærtorsdag (3 dagar fyre påske)
- Langfredag (2 dagar fyre påske)
- Fyrste påskedag
- Andre påskedag
- Kristi himmelfartsdag (39 dagar etter påske)
- Fyrste pinsedag (49 dagar etter påske)
- Andre pinsedag (50 dagar etter påske)

## Teknisk

Kalenderen er bygt med rein HTML, CSS og JavaScript utan avhengigheiter til eksterne bibliotek.

Rørlege høgtidsdagar vert rekna ut frå påskedagen ved hjelp av den anonyme gregorianske algoritmen (*Computus*).

### Filstruktur

```
├── index.html                # HTML-struktur
├── styles.css                # Stilark
├── calendar.js               # Kalenderlogikk
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD-arbeidsflyt
└── terraform/
    ├── providers.tf          # Terraform-leverandørar
    ├── variables.tf          # Inngansvariablar
    ├── main.tf               # Infrastrukturressursar
    ├── outputs.tf            # Utgansverdiar
    └── terraform.tfvars.example
```

## Utplassering på AWS

Kalenderen vert utplassert på AWS med S3 og CloudFront. All infrastruktur kan opprettast med Terraform.

### Føresetnader

- [Terraform](https://www.terraform.io/downloads) >= 1.0
- [AWS CLI](https://aws.amazon.com/cli/) konfigurert med tilgangsløyve
- Eit domenenamn (t.d. `kalender.example.no`)

### Oppsett med Terraform

#### 1. Konfigurer variablar

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Rediger `terraform.tfvars` med dine verdiar:

```hcl
aws_region  = "eu-north-1"
bucket_name = "mitt-kalender-bucket"
domain_name = "kalender.mittdomene.no"
github_org  = "mitt-brukarnamn"
github_repo = "nynorsk-kalender"
```

#### 2. Køyr Terraform

```bash
terraform init
terraform plan
terraform apply
```

#### 3. Valider SSL-sertifikatet

Terraform syner DNS-oppføringane som trengst for å validera SSL-sertifikatet. Legg desse til hjå din DNS-leverandør.

Sjå etter utdata frå `acm_certificate_validation`:

```
acm_certificate_validation = {
  "kalender.example.no" = {
    name  = "_abc123.kalender.example.no."
    type  = "CNAME"
    value = "_xyz789.acm-validations.aws."
  }
}
```

#### 4. Pek domenet til CloudFront

Legg til ein CNAME-oppføring hjå din DNS-leverandør:

```
Type:  CNAME
Namn:  kalender (eller @ for rotdomenet)
Verdi: <cloudfront_domain_name frå terraform output>
```

#### 5. Konfigurer GitHub

Terraform syner alle verdiane du treng. Legg dei til i GitHub-repositoriet:

**Settings → Secrets and variables → Actions**

Hemmelegheiter (Secrets):
- `AWS_ROLE_ARN` → verdien frå `github_actions_role_arn`

Variablar (Variables):
- `AWS_REGION` → verdien frå `aws_region`
- `S3_BUCKET_NAME` → verdien frå `s3_bucket_name`
- `CLOUDFRONT_DISTRIBUTION_ID` → verdien frå `cloudfront_distribution_id`

#### 6. Fyrste utrulling

Push til `main`-greina eller køyr arbeidsflyten manuelt frå GitHub Actions.

### Manuelt oppsett (utan Terraform)

Sjå kommentert JSON-konfigurasjon nedanfor om du ynskjer å setja opp infrastrukturen manuelt.

<details>
<summary>IAM-rolle og OIDC-tillit</summary>

#### IAM-rolle

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::DI-BØTTE-HER",
                "arn:aws:s3:::DI-BØTTE-HER/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": "cloudfront:CreateInvalidation",
            "Resource": "arn:aws:cloudfront::KONTO-ID:distribution/FORDELING-ID"
        }
    ]
}
```

#### OIDC-tillit

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::KONTO-ID:oidc-provider/token.actions.githubusercontent.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                },
                "StringLike": {
                    "token.actions.githubusercontent.com:sub": "repo:BRUKARNAMN/REPO:*"
                }
            }
        }
    ]
}
```

</details>

## Lokal utvikling

For å køyra kalenderen lokalt, opna `index.html` i ein nettlesar eller nytt ein enkel HTTP-tenar:

```bash
python3 -m http.server 8000
```

Gå deretter til `http://localhost:8000` i nettlesaren.

## Fjerning av infrastruktur

For å fjerna all infrastruktur frå AWS:

```bash
cd terraform
terraform destroy
```

**Merk:** S3-bøtta må vera tom fyre ho kan slettast. Køyr dette fyrst:

```bash
aws s3 rm s3://ditt-bucket-namn --recursive
```

## Lisens

Dette verket er lisensiert under ein [Creative Commons Namngjeving-IkkeKommersiell-DelPåSameVilkår 4.0 Internasjonal lisens](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.nn).

[![CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.nn)
