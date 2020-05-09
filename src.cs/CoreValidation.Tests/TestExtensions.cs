using System;
using Xunit;

namespace CoreValidation.Tests
{
  public static class TestExtensions
  {
    public static string ToBlob(this (object, bool, Func<object>) source) => $"{source.Item1},{(source.Item2 ? "true" : "false")},";
  }
}
