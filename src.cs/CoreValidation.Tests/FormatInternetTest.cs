using Shouldly;
using Xunit;
using static CoreValidation.Formats.Internet;
using static CoreValidation.Globals;

namespace CoreValidation.Tests
{
  public class FormatInternetTest
  {
    [Fact]
    public void Email()
    {
      // should format
      {
        EmailFormatter(null).ShouldBe(NulFormat);
        EmailFormatter("").ShouldBe(NulFormat);
        EmailFormatter("anything").ShouldBe("anything");
      }
      // should parse
      {
        EmailParser(null).ShouldBe((null, true, null));
        EmailParser("").ShouldBe(("", true, null));
        EmailParser("bad.com").ShouldBe(("bad.com", false, null));
        EmailParser("valid@email.com").ShouldBe(("valid@email.com", true, null));
      }
    }

    [Fact]
    public void Email_List()
    {
      // should format
      {
        EmailListFormatter(null).ShouldBe(NulFormat);
        EmailListFormatter("").ShouldBe(NulFormat);
        EmailListFormatter("anything").ShouldBe("anything");
      }
      // should parse
      {
        EmailListParser(null).ShouldBe((null, true, null));
        EmailListParser("").ShouldBe(("", true, null));
        EmailListParser("bad.com").ShouldBe(("bad.com", false, null));
        EmailListParser("valid@email.com").ShouldBe(("valid@email.com", true, null));
        // list
        EmailListParser("bad.com, valid@email.com").ShouldBe(("bad.com, valid@email.com", false, null));
        EmailListParser("valid@email.com, valid@email.com").ShouldBe(("valid@email.com; valid@email.com", true, null));
        EmailListParser("valid@email.com, ,valid@email.com").ShouldBe(("valid@email.com; valid@email.com", true, null));
      }
      // should parse: maxCount
      {
        EmailListParser("valid@email.com, valid@email.com", new { maxCount = 1 }.ToParam()).ShouldBe(("valid@email.com, valid@email.com", false, null));
        EmailListParser("valid@email.com, valid@email.com", new { maxCount = 2 }.ToParam()).ShouldBe(("valid@email.com; valid@email.com", true, null));
      }
    }

    [Fact]
    public void Hostname()
    {
      // should format
      {
        HostnameFormatter(null).ShouldBe(NulFormat);
        HostnameFormatter("").ShouldBe(NulFormat);
        HostnameFormatter("anything").ShouldBe("anything");
      }
      // should parse
      {
        HostnameParser(null).ShouldBe((null, true, null));
        HostnameParser("").ShouldBe(("", true, null));
        HostnameParser("bad-com").ShouldBe(("bad-com", false, null));
        HostnameParser("good.com").ShouldBe(("good.com", true, null));
      }
    }

    [Fact]
    public void Hostname_List()
    {
      // should format
      {
        HostnameListFormatter(null).ShouldBe(NulFormat);
        HostnameListFormatter("").ShouldBe(NulFormat);
        HostnameListFormatter("anything").ShouldBe("anything");
      }
      // should parse
      {
        HostnameListParser(null).ShouldBe((null, true, null));
        HostnameListParser("").ShouldBe(("", true, null));
        HostnameListParser("bad-com").ShouldBe(("bad-com", false, null));
        HostnameListParser("good.com").ShouldBe(("good.com", true, null));
        // list
        HostnameListParser("bad-com, good.com").ShouldBe(("bad-com, good.com", false, null));
        HostnameListParser("good.com, good.com").ShouldBe(("good.com; good.com", true, null));
        HostnameListParser("good.com, ,good.com").ShouldBe(("good.com; good.com", true, null));
      }
      // should parse: maxCount
      {
        HostnameListParser("good.com, good.com", new { maxCount = 1 }.ToParam()).ShouldBe(("good.com, good.com", false, null));
        HostnameListParser("good.com, good.com", new { maxCount = 2 }.ToParam()).ShouldBe(("good.com; good.com", true, null));
      }
    }

    [Fact]
    public void Uri()
    {
      // should format
      {
        UriFormatter(null).ShouldBe(NulFormat);
        UriFormatter("").ShouldBe(NulFormat);
        UriFormatter("anything").ShouldBe("anything");
      }
      // should parse
      {
        UriParser(null).ShouldBe((null, true, null));
        UriParser("").ShouldBe(("", true, null));
        UriParser("anything").ShouldBe(("anything", true, null));
      }
    }

    [Fact]
    public void Xml()
    {
      // should format
      XmlFormatter(null).ShouldBe(NulFormat);
      XmlFormatter("").ShouldBe(NulFormat);
      XmlFormatter("anything").ShouldBe("anything");
      // should parse
      XmlParser(null).ShouldBe((null, true, null));
      XmlParser("").ShouldBe(("", true, null));
      XmlParser("anything").ShouldBe(("anything", true, null));
    }
  }
}
