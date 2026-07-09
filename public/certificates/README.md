Place real Sijil Amalan image files in this folder.

Example file path:

`public/certificates/nuaim-selangor.jpg`

Then add it to the relevant lawyer in `lib/site-data.ts`:

```ts
certificates: [
  {
    negeri: "Selangor",
    title: "Sijil Amalan Peguam Syarie Selangor",
    href: "/certificates/nuaim-selangor.jpg",
    type: "image"
  }
]
```

Supported `type` values:

- `"image"` for `.jpg`, `.jpeg`, `.png`, `.webp`
- `"pdf"` if a certificate is later provided as PDF

Only add real certificate details from the actual certificate.
