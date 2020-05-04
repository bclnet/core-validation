//using Xunit;
//using static CoreValidation.Formats.Internet;
//using static CoreValidation.Globals;

//namespace CoreValidation.Tests
//{
//  public class ExecutionTest
//  {
//    [Fact]
//    public void Valid()
//    {
//      // should format
//      {
//        Assert2.Equal(EmailFormatter(null), NulFormat);
//        Assert2.Equal(EmailFormatter(""), NulFormat);
//        Assert2.Equal(EmailFormatter("anything"), "anything");
//      }
//      // should parse
//      {
//        Assert2.Equal(EmailParser(null), (null, true, null));
//        Assert2.Equal(EmailParser(""), ("", true, null));
//        Assert2.Equal(EmailParser("bad.com"), ("bad.com", false, null));
//        Assert2.Equal(EmailParser("valid@email.com"), ("valid@email.com", true, null));
//      }
//    }

//    [Fact]
//    public void Email_List()
//    {
//      // should format
//      {
//        Assert2.Equal(EmailListFormatter(null), NulFormat);
//        Assert2.Equal(EmailListFormatter(""), NulFormat);
//        Assert2.Equal(EmailListFormatter("anything"), "anything");
//      }
//      // should parse
//      {
//        Assert2.Equal(EmailListParser(null), (null, true, null));
//        Assert2.Equal(EmailListParser(""), ("", true, null));
//        Assert2.Equal(EmailListParser("bad.com"), ("bad.com", false, null));
//        Assert2.Equal(EmailListParser("valid@email.com"), ("valid@email.com", true, null));
//        // list
//        Assert2.Equal(EmailListParser("bad.com, valid@email.com"), ("bad.com, valid@email.com", false, null));
//        Assert2.Equal(EmailListParser("valid@email.com, valid@email.com"), ("valid@email.com; valid@email.com", true, null));
//        Assert2.Equal(EmailListParser("valid@email.com, ,valid@email.com"), ("valid@email.com; valid@email.com", true, null));
//      }
//      // should parse: maxCount
//      {
//        Assert2.Equal(EmailListParser("valid@email.com, valid@email.com", new { maxCount = 1 }.ToParam()), ("valid@email.com, valid@email.com", false, null));
//        Assert2.Equal(EmailListParser("valid@email.com, valid@email.com", new { maxCount = 2 }.ToParam()), ("valid@email.com; valid@email.com", true, null));
//      }
//    }

//    [Fact]
//    public void Hostname()
//    {
//      // should format
//      {
//        Assert2.Equal(HostnameFormatter(null), NulFormat);
//        Assert2.Equal(HostnameFormatter(""), NulFormat);
//        Assert2.Equal(HostnameFormatter("anything"), "anything");
//      }
//      // should parse
//      {
//        Assert2.Equal(HostnameParser(null), (null, true, null));
//        Assert2.Equal(HostnameParser(""), ("", true, null));
//        Assert2.Equal(HostnameParser("bad-com"), ("bad-com", false, null));
//        Assert2.Equal(HostnameParser("good.com"), ("good.com", true, null));
//      }
//    }

//    [Fact]
//    public void Hostname_List()
//    {
//      // should format
//      {
//        Assert2.Equal(HostnameListFormatter(null), NulFormat);
//        Assert2.Equal(HostnameListFormatter(""), NulFormat);
//        Assert2.Equal(HostnameListFormatter("anything"), "anything");
//      }
//      // should parse
//      {
//        Assert2.Equal(HostnameListParser(null), (null, true, null));
//        Assert2.Equal(HostnameListParser(""), ("", true, null));
//        Assert2.Equal(HostnameListParser("bad-com"), ("bad-com", false, null));
//        Assert2.Equal(HostnameListParser("good.com"), ("good.com", true, null));
//        // list
//        Assert2.Equal(HostnameListParser("bad-com, good.com"), ("bad-com, good.com", false, null));
//        Assert2.Equal(HostnameListParser("good.com, good.com"), ("good.com; good.com", true, null));
//        Assert2.Equal(HostnameListParser("good.com, ,good.com"), ("good.com; good.com", true, null));
//      }
//      // should parse: maxCount
//      {
//        Assert2.Equal(HostnameListParser("good.com, good.com", new { maxCount = 1 }.ToParam()), ("good.com, good.com", false, null));
//        Assert2.Equal(HostnameListParser("good.com, good.com", new { maxCount = 2 }.ToParam()), ("good.com; good.com", true, null));
//      }
//    }

//    [Fact]
//    public void Uri()
//    {
//      // should format
//      {
//        Assert2.Equal(UriFormatter(null), NulFormat);
//        Assert2.Equal(UriFormatter(""), NulFormat);
//        Assert2.Equal(UriFormatter("anything"), "anything");
//      }
//      // should parse
//      {
//        Assert2.Equal(UriParser(null), (null, true, null));
//        Assert2.Equal(UriParser(""), ("", true, null));
//        Assert2.Equal(UriParser("anything"), ("anything", true, null));
//      }
//    }

//    [Fact]
//    public void Xml()
//    {
//      // should format
//      Assert2.Equal(XmlFormatter(null), NulFormat);
//      Assert2.Equal(XmlFormatter(""), NulFormat);
//      Assert2.Equal(XmlFormatter("anything"), "anything");
//      // should parse
//      Assert2.Equal(XmlParser(null), (null, true, null));
//      Assert2.Equal(XmlParser(""), ("", true, null));
//      Assert2.Equal(XmlParser("anything"), ("anything", true, null));
//    }
//  }
//}
