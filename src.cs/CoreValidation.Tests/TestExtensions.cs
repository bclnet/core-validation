using System;
using Xunit;

namespace CoreValidation.Tests
{
  public static class Assert2
  {
    public static string ToString(this (object, bool, Func<object>) source) => $"{source.Item1},{source.Item2},";

    //public static void Same(object actual, object expected) => Assert.Same(expected, actual);
    public static void Equal<T>(T actual, T expected) => Assert.Equal(expected, actual);
    public static void Equal(string actual, string expected) => Assert.Equal(expected, actual);
  }
}
