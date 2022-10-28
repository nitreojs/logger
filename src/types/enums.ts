export enum Color {
  Black = 30,
  Red = 31,
  Green = 32,
  Yellow = 33,
  Blue = 34,
  Magenta = 35,
  Cyan = 36,
  White = 37,
  Gray = 90,

  End = 39
}

export enum BackgroundColor {
  Black = 40,
  Red = 41,
  Green = 42,
  Yellow = 43,
  Blue = 44,
  Magenta = 45,
  Cyan = 46,
  White = 47,

  End = 49
}

export enum TextStyle {
  Reset = 0,

  Bold = 1,
  BoldEnd = 22,

  Dim = 2,
  DimEnd = 22,

  Italic = 3,
  ItalicEnd = 23,

  Underline = 4,
  UnderlineEnd = 24,

  Inverse = 7,
  InverseEnd = 27,

  Hidden = 8,
  HiddenEnd = 28,

  Strikethrough = 9,
  StrikethroughEnd = 29
}
